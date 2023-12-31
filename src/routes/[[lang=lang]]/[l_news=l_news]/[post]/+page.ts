import LL, { setLocale } from '$i18n/i18n-svelte.js';
import { get } from 'svelte/store';
import type { PageLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { getPageParams, href, setPageParam, validatePage } from '$lib/index.js';
import { baseLocale } from '$i18n/i18n-util.js';

export const load: PageLoad = async ({ url, parent, data: { post } }) => {
	// wait for `+layout.ts` to load dictionary and pass locale information
	const { locale, LP } = await parent();

	// if you need to output a localized string in a `load` function,
	// you always need to call `setLocale` right before you access the `LL` store
	setLocale(locale);
	// get the translation functions value from the store
	const $LL = get(LL);
	console.info($LL.log({ fileName: 'routes/[[lang=lang]]/[l_about=l_about]/[post]/+page.ts' }));

	if (!post) {
		throw error(404);
	}

	/**
	 * This page depends on the slug param `post`. And in our case this slug is localized too.
	 * Which is why we need to set a page param with the allowed values.
	 */
	setPageParam(LP, 'post', post.slugs);

	/**
	 * Create fallback path that will be suggested to a visitor if the requested post isn't available
	 * for their locale (404).
	 */
	const fallbackPath = href(LP, baseLocale, {
		base: url.pathname,
		params: getPageParams(LP, true)
	});

	/**
	 * Since we added a new param we need to revalidate the page.
	 * Just like before this may result in a redirect or a 404 page.
	 */
	validatePage(LP, {
		notFound: {
			message: $LL.pageError.messageNotTranslated(),
			link: fallbackPath,
			linkText: $LL.pageError.actionBaseLocale()
		}
	});

	return {
		title: post.title,
		post
	};
};
