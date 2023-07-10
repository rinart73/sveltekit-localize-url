import LL, { setLocale, locale as storeLocale } from '$i18n/i18n-svelte.js';
import { loadLocaleAsync } from '$i18n/i18n-util.async.js';
import { get } from 'svelte/store';
import { initLocalizeUrl, localizePage } from '$lib/index.js';
import { baseLocale, locales } from '$i18n/i18n-util.js';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types.js';

export const load: LayoutLoad = async ({ url, route, data: { locale } }) => {
	// initialize Localize URL library for client (already initialized on server)
	initLocalizeUrl({
		baseLocale,
		locales
	});

	/**
	 * Make sure that we're not overriding clientside typesafe-i18n locale when preloading pages on link hover.
	 * An alternative solution is setting `data-sveltekit-preload-data` on the `body` tag to `tap` of `off`.
	 */
	let loadLocale = true;
	if (browser) {
		const $storeLocale = get(storeLocale);
		if ($storeLocale !== undefined) {
			locale = $storeLocale;
			loadLocale = false;
		}
	}

	if (loadLocale) {
		// load dictionary into memory
		await loadLocaleAsync(locale);
	}

	// if you need to output a localized string in a `load` function,
	// you always need to call `setLocale` right before you access the `LL` store
	setLocale(locale);
	// get the translation functions value from the store
	const $LL = get(LL);
	console.info($LL.log({ fileName: 'routes/+layout.ts' }));

	/**
	 * We need to create localized page exactly here at the top layer ('routes/+layout.ts'),
	 * so even if during page validation a 404 will be thrown, layout and error page could still access it.
	 */
	const LP = localizePage(url, route.id);

	// pass locale and localized page to the "rendering context"
	return { locale, LP };
};
