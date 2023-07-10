import { href, validatePage, getPageParams } from '$lib/index.js';
import { get } from 'svelte/store';
import LL, { setLocale } from '$i18n/i18n-svelte.js';
import { baseLocale } from '$i18n/i18n-util.js';
import type { LayoutLoad } from './$types.js';

export const load: LayoutLoad = async ({ parent, url }) => {
	// wait for parent `+layout.ts` to load dictionary and pass locale information
	const { locale, LP } = await parent();

	// if you need to output a localized string in a `load` function,
	// you always need to call `setLocale` right before you access the `LL` store
	setLocale(locale);
	// get the translation functions value from the store
	const $LL = get(LL);
	console.info($LL.log({ fileName: 'routes/[[lang=lang]]/+layout.ts' }));

	/**
	 * Create fallback path that will be suggested to a visitor if the requested page isn't available
	 * for their locale (404).
	 */
	const fallbackPath = href(LP, baseLocale, {
		base: url.pathname,
		params: getPageParams(LP)
	});

	/**
	 * Localized page validation should happen exactly here in the `routes/[[lang=lang]]/+layout.ts` and NOT in the
	 * `routes/+layout.ts`. There are 2 reasons for this:
	 * 1. We shouldn't validate paths like `/api`.
	 * 2. "If the error occurs inside a load function in `+layout(.server).js`, the closest error boundary in the tree
	 *      is an `+error.svelte` file above that layout (not next to it)." - https://kit.svelte.dev/docs/errors#responses
	 *      In other words, when a 404 is thrown here, the `routes/+error.svelte` layout will be used.
	 *      If we place validation in the `routes/+layout.ts`, there won't be an error layout to use, so SvelteKit will
	 *      use a default empty white page with a 404 code.
	 */
	validatePage(LP, {
		notFound: {
			message: $LL.pageError.messageNotTranslated(),
			link: fallbackPath,
			linkText: $LL.pageError.actionBaseLocale()
		}
	});

	// pass locale and localized page to the "rendering context"
	return { locale, LP };
};
