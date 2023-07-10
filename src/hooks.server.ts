import type { Locales } from '$i18n/i18n-types.js';
import { baseLocale, detectLocale, i18n, locales } from '$i18n/i18n-util.js';
import { loadAllLocales } from '$i18n/i18n-util.sync.js';
import { getLocaleFromUrl, getLocaleHomeHref, initLocalizeUrl } from '$lib/index.js';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

loadAllLocales();
const L = i18n();

export const handle: Handle = async ({ event, resolve }) => {
	// initialize Localize URL library on server
	initLocalizeUrl({
		baseLocale,
		locales
	});
	const locale = getLocaleFromUrl(event.url) as Locales;

	// track the first visit for language detection
	let hasVisited = true;
	// only count translateable part of the website (exclude API)
	if ((event.route.id ?? '').startsWith('/[[lang=lang]]')) {
		hasVisited = event.cookies.get('visited') === '1';
	}
	if (!hasVisited) {
		event.cookies.set('visited', '1', { path: '/' });
	}

	/**
	 * Redirect first time home page visitor based on their detected locale.
	 * ! WARNING: Google advises against this:
	 * ! https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#let-the-user-switch-the-page-language
	 */
	if (!hasVisited && event.url.pathname === '/') {
		const detectedLocale = getPreferredLocale(event);
		if (detectedLocale !== locale) {
			const localeHomeUrl = getLocaleHomeHref(detectedLocale, event.url, true);
			throw redirect(302, localeHomeUrl);
		}
	}

	const LL = L[locale];

	// bind locale and translation functions to current request
	event.locals.locale = locale;
	event.locals.LL = LL;

	console.info(LL.log({ fileName: 'hooks.server.ts' }));

	// replace html lang attribute with correct language
	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', locale) });
};

const getPreferredLocale = ({ request }: RequestEvent) => {
	// Detect the preferred language the user has configured in his browser
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);

	return detectLocale(acceptLanguageDetector);
};
