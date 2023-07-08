import { error, redirect } from '@sveltejs/kit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { HttpError, Redirect } from '@sveltejs/kit';

export type LocalizeUrlSettings = {
	/**
	 * Default locale.
	 */
	baseLocale: string;
	/**
	 * Enabled locales.
	 */
	locales: string[];
	/**
	 * If true, the correct pathname for `/page` is `/baseLocale/page`.
	 */
	addBaseLocaleToPath?: boolean;
	/**
	 * Locales matched by hosts. If specified, the correct path for `example.com/de/page` is `example.de/page`.
	 */
	localeHosts?: Partial<Record<string, string>>;
};

const settings: LocalizeUrlSettings & {
	/**
	 * Registered localized params.
	 */
	paramRegistry: Map<string, LocalizedParam>;
	isInitialized: boolean;
} = {
	baseLocale: '',
	locales: [],
	paramRegistry: new Map(),
	isInitialized: false
};

/**
 * Initializes the library.
 * @param baseLocale Default locale.
 * @param locales Enabled locales.
 * @param addBaseLocaleToPath If true, the correct pathname for `/page` is `/baseLocale/page`.
 * @param localeHosts Locales matched by hosts. If specified, the correct path for
 *      `example.com/de/page` is `example.de/page`.
 */
export function initLocalizeUrl(newSettings: LocalizeUrlSettings) {
	if (settings.isInitialized) return;

	if (newSettings.localeHosts) {
		if (!(newSettings.baseLocale in newSettings.localeHosts)) {
			throw new Error(
				`Host for the base locale "${newSettings.baseLocale}" is not specified`
			);
		}
		newSettings.addBaseLocaleToPath = false;
	}
	Object.assign(settings, newSettings);
	settings.isInitialized = true;
}

/**
 * For testing only
 */
export function resetSettings() {
	settings.baseLocale = '';
	settings.locales = [];
	settings.paramRegistry.clear();
	settings.isInitialized = false;
	delete settings.addBaseLocaleToPath;
	delete settings.localeHosts;
}

/** ==== Helpers ==== */

const isLocale = (locale: string) => settings.locales.includes(locale);

/**
 * Detects URL locale based on the pathname or the host (if `localeHosts` was specified during init).
 */
export function getLocaleFromUrl(url: URL): string {
	const [, lang] = url.pathname.split('/');
	if (isLocale(lang)) return lang;

	if (settings.localeHosts) {
		for (const [locale, host] of Object.entries(settings.localeHosts)) {
			if (host === url.host) {
				return locale;
			}
		}
	}
	return settings.baseLocale;
}

/**
 * Builds a URL href for a home page in a specified locale.
 * @param currentUrl Current URL to use as a base.
 * @param locale Desired locale.
 * @param leaveSearch If true, search and hash won't be removed.
 */
export function getLocaleHomeHref(locale: string, currentUrl: URL, leaveSearch = false): string {
	const url = new URL(currentUrl);
	url.pathname = '/';
	if (!leaveSearch) {
		url.search = '';
		url.hash = '';
	}
	if (settings.localeHosts) {
		const host = settings.localeHosts[locale];
		if (host) {
			// url leads to another domain
			url.host = host;
			return url.href;
		}
	}
	// add locale prefix
	if (settings.addBaseLocaleToPath || settings.baseLocale !== locale) {
		url.pathname = `/${locale}`;
	}
	return url.href;
}

/** ==== Param ==== */

export type LocalizedParam = {
	/**
	 * Position in the pathname.
	 */
	position: number;
	/**
	 * Param name.
	 */
	name: string;
	/**
	 * Locales matched by paths.
	 */
	values: Partial<Record<string, string>>;
};

/**
 * Registers localized param.
 * @param position Param segment position in the URL starting with 1.
 * @param name Unique param name that matches router param name.
 * @param values Supported locales and their corresponding values.
 * @returns Localized param.
 * @example
 * ```typescript
 * // src/params/l_faq.ts - for URL: /[l_about]/[l_faq]
 * const localizedParam = localizeParam(2, 'l_faq', {
 *   en: 'faq',
 *   ru: 'voprosi-i-otveti'
 * })
 * ```
 */
export function localizeParam(
	position: number,
	name: string,
	values: Partial<Record<string, string>>
): LocalizedParam {
	const result: LocalizedParam = {
		name,
		position,
		values
	};
	settings.paramRegistry.set(name, result);
	return result;
}

/**
 * Checks if the route param value matches any of the localized param values.
 * @example
 * ```typescript
 * export const match: ParamMatcher = (param) => matchParam(param, localizedParam)
 * ```
 */
export function matchParam(routeParamValue: string, param: LocalizedParam): boolean {
	return Object.values(param.values).includes(routeParamValue);
}

/** ==== Page ==== */

export type LocalizedPage = {
	/**
	 * Localized URL hrefs by locale for `<link rel="alternate" hreflang="locale"` tags.
	 * If a href doesn't exist for the locale, it won't be added here.
	 */
	hreflang: Map<string, string>;
	/**
	 * Localized URL hrefs by locale for a language switcher.
	 * If a href doesn't exist for the locale, it will default to a home page href (`/de`).
	 */
	switcher: Map<string, string>;
	/**
	 * Current page URL.
	 */
	_url: URL;
	/**
	 * Matched route id.
	 */
	_routeId: string | null;
	/**
	 * Route params and their positions in the pathname.
	 */
	_paramPositions: Map<string, number>;
	/**
	 * Custom page-specific params like post slugs.
	 */
	_customParams: Map<string, LocalizedParam>;
	/**
	 * Alternate hrefs need to be rebuilt.
	 */
	_isDirty: boolean;
	/**
	 * If the {@link checkPage} function marked that this page is not available for a requested locale.
	 */
	_isNotAvailableForLocale: boolean;
};

/**
 * Builds new localized page object.
 * @param url Current URL.
 * @param routeId Matched route id.
 */
export function localizePage(url: URL, routeId: string | null): LocalizedPage {
	// find matched route params and their positions
	const paramPositions = new Map<string, number>();
	if (routeId) {
		const parts = routeId.split('/');
		for (let pos = 2; pos < parts.length; pos++) {
			const part = parts[pos];
			if (part[0] !== '[') continue;

			let name = part[1] === '[' ? part.slice(2, -2) : part.slice(1, -1);
			name = name.split('=')[0];
			paramPositions.set(name, pos - 1);
		}
	}
	return {
		hreflang: new Map(),
		switcher: new Map(),
		_url: new URL(url),
		_routeId: routeId,
		_paramPositions: paramPositions,
		_customParams: new Map(),
		_isDirty: true,
		_isNotAvailableForLocale: false
	};
}

/**
 * Set locales and matching values for dynamic params that depend on the server (like post slugs).
 * @param values Locales matched by values. Doesn't have to include all locales.
 * @example
 * ```typescript
 * // Route: /[l_news]/[category]/[post]. [category] and [post] are used to fetch an article from DB
 * setPageParam(localizedPage, 'category', post.category.slugs);
 * setPageParam(localizedPage, 'post', post.slugs);
 * ```
 */
export function setPageParam(
	page: LocalizedPage,
	name: string,
	values: Partial<Record<string, string>>
) {
	const position = page._paramPositions.get(name);
	if (!position) {
		console.error(
			`svelte-localize-url: Param "${name}" isn't used at the route "${page._routeId}"`
		);
		return;
	}

	page._customParams.set(name, {
		position,
		name,
		values
	});
	page._isDirty = true;
}

/**
 * Retrieves page params (localized and optionally custom).
 * @param page Localized page.
 * @param includeCustom If true, includes custom params such as slugs.
 */
export function getPageParams(page: LocalizedPage, includeCustom = false): LocalizedParam[] {
	const params: LocalizedParam[] = [];
	for (const [name] of page._paramPositions) {
		let param = settings.paramRegistry.get(name);
		if (!param && includeCustom) {
			param = page._customParams.get(name);
		}
		if (param) {
			params.push(param);
		}
	}
	return params;
}

/** ==== Paths ==== */

/**
 * Attempts to create a new URL href for the desired locale.
 * @param page Localized page.
 * @param locale Desired locale.
 * @param pathname A new pathname to be localized. Can include localized parameters `[l_param]`.
 * @param useFallback If true, when one of the parameters doesn't support requested locale,
 *      the function will generate a href for the base locale instead.
 * @returns Localized href or an empty string if that is not possible.
 * @example
 * ```typescript
 * const pathFAQ = href(localizedPage, 'ru', '/[l_about]/[l_faq]')
 * const pathNewsPost = href(localizedPage, 'ru', '/[l_news]/[category]/[post]')
 * ```
 */
export function href(
	page: LocalizedPage,
	locale: string,
	pathname: string,
	useFallback?: boolean
): string;

/**
 * Attempts to transform a base pathname, replacing its parts according to the params.
 * @param page Localized page.
 * @param locale Desired locale.
 * @param transform Contents:
 * - `base` - An old pathname (shouldn't include any excplicitly stated `[l_param]` params).
 * - `params` - A list of localized params or their names that should be used.
 * @param useFallback If true, when one of the parameters doesn't support requested locale,
 *      the function will generate a href for the base locale instead.
 * @returns Transformed localized href or an empty string if that is not possible.
 * @example
 * ```typescript
 * const pathFAQ = href(localizedPage, 'ru', {
 *   base: url.pathname,
 *   params: ['l_about', 'l_faq']
 * })
 * ```
 */
export function href(
	page: LocalizedPage,
	locale: string,
	transform: {
		base: string;
		params: (LocalizedParam | string)[];
	},
	useFallback?: boolean
): string;

export function href(
	page: LocalizedPage,
	locale: string,
	pathData:
		| string
		| {
				base: string;
				params: (LocalizedParam | string)[];
		  },
	useFallback?: boolean
): string;

export function href(
	page: LocalizedPage,
	locale: string,
	pathData:
		| string
		| {
				base: string;
				params: (LocalizedParam | string)[];
		  },
	useFallback = false
): string {
	let parts: string[];
	let usedParams: (LocalizedParam | string)[];
	if (typeof pathData === 'string') {
		// new pathname
		usedParams = [];
		parts = pathData.split('/');

		// find params that are used in the pathname
		for (let i = 1; i < parts.length; i++) {
			const part = parts[i];
			if (part[0] !== '[') continue;

			const name = part.slice(1, -1);
			let param = settings.paramRegistry.get(name);
			if (!param) {
				param = page._customParams.get(name);
			}
			if (!param) {
				console.error(
					`svelte-localize-url: Param "${name}" that is inferred from the path "${pathData}"` +
						` doesn't exist at the route "${page._routeId}"`
				);
				return '';
			}
			if (param.position !== i) {
				console.error(
					`svelte-localize-url: Param "${name}" that is inferred from the path "${pathData}"` +
						` is in the wrong position ${i} (${param.position} expected) at the route "${page._routeId}"`
				);
				return '';
			}

			usedParams.push(param);
		}
	} else {
		// build on top of a base pathname
		parts = pathData.base.split('/');
		usedParams = pathData.params;
	}

	if (parts[1] === '' || isLocale(parts[1])) {
		// remove locale for now
		parts.splice(1, 1);
	}

	// replace parts of the original pathname
	for (const name of usedParams) {
		let param = typeof name === 'string' ? settings.paramRegistry.get(name) : name;
		if (!param) {
			param = page._customParams.get(name as string);
		}
		if (!param) {
			console.error(
				`svelte-localize-url: Param "${name}" doesn't exist at the route "${page._routeId}"`
			);
			return '';
		}

		const value = param.values[locale];
		if (value) {
			parts[param.position] = value;
			continue;
		}

		// no path for this locale
		if (useFallback) {
			return href(page, settings.baseLocale, pathData);
		}

		return '';
	}

	// assemble final href
	let pathname = parts.join('/');
	// copy url without search and hash
	const url = new URL('/', page._url);
	if (settings.localeHosts) {
		let host = settings.localeHosts[locale];
		if (!host) {
			// host is not specified for a locale - use the base locale host but add the locale in the pathname
			host = settings.localeHosts[settings.baseLocale] as string;
			pathname = `/${locale}${pathname}`;
		}
		url.host = host;
		url.pathname = pathname;
		return url.href;
	}

	// all locales that are on the same host to the pathname
	if (settings.addBaseLocaleToPath || settings.baseLocale !== locale) {
		pathname = `/${locale}${pathname}`;
	}
	url.pathname = pathname;
	return url.href;
}

/**
 * A helper function that acts similarly to the {@link href} but instead returns a string that contains
 *      the resulting href.
 * @param page Localized page.
 * @param locale Desired locale.
 * @param pathname A new pathname to be localized. Can include localized parameters `[l_param]`.
 * @param text A text that will be returned if the path is localized successfully.
 *        Must contain a `%href%` piece that will be replaced with the localized href.
 * @param useFallback If true, when one of the parameters doesn't support requested locale,
 *        the function use generate a href for the base locale instead.
 * @example
 * ```svelte
 * {@html wrapHref(localizedPage, 'ru', '/[l_about]/[l_faq]', `<a href="%href%">${$LL.pageFAQ()}</a>`)}
 * ```
 */
export function wrapHref(
	page: LocalizedPage,
	locale: string,
	pathname: string,
	text: string,
	useFallback = false
): string {
	const localizedPath = href(page, locale, pathname, useFallback);
	if (!localizedPath) return '';

	return text.replace('%href%', localizedPath);
}

/**
 * Regenerates alternate links and returns localized page.
 * @param page Localized page.
 * @param pageError If there is a page error
 */
export function buildAlternateLinks(
	page: LocalizedPage,
	pageError: App.Error | boolean | null = false
): LocalizedPage {
	if (!page._isDirty) return page;
	page._isDirty = false;

	// get localized params and custom slugs
	const params = getPageParams(page, true);

	// regenerate alternate links
	page.switcher.clear();
	page.hreflang.clear();

	if (page._isNotAvailableForLocale || !!pageError) {
		// only generate language switcher links
		for (const locale of settings.locales) {
			page.switcher.set(locale, getLocaleHomeHref(locale, page._url));
		}
		return page;
	}

	for (const locale of settings.locales) {
		const localizedPath = href(page, locale, {
			base: page._url.pathname,
			params
		});
		if (localizedPath) {
			page.hreflang.set(locale, localizedPath);
			// leave search and hash in switcher for better usability
			const switcherUrl = new URL(localizedPath);
			switcherUrl.search = page._url.search;
			// it's better to update hash dynamically in the language switcher component
			// switcherUrl.hash = page._url.hash;
			page.switcher.set(locale, switcherUrl.href);
			continue;
		}
		// no path for locale, point to the home page
		page.switcher.set(locale, getLocaleHomeHref(locale, page._url));
	}

	return page;
}

/** ==== Validation ==== */

export enum PageCheckResult {
	Success = 0,
	Corrected = 1,
	NotLocalized = 2
}

/**
 * Checks if the page URL is correct for a given locale.
 * @param page Localized page.
 * @param locale Current locale.
 * @returns Check result, optionally followed by a correct path (if redirect is needed).
 */
export function checkPage(
	page: LocalizedPage,
	locale: string
): [PageCheckResult.Corrected, string] | [PageCheckResult] {
	const correctPath = href(page, locale, {
		base: page._url.pathname,
		params: getPageParams(page, true)
	});
	if (!correctPath) {
		// not available for this locale
		page._isNotAvailableForLocale = true;
		return [PageCheckResult.NotLocalized];
	}
	if (correctPath !== page._url.href) {
		return [PageCheckResult.Corrected, correctPath];
	}
	return [PageCheckResult.Success];
}

export type ValidatePageOptions = {
	/**
	 * Default: 301. Which HTTP code to use when redirecting to a corrected localized URL.
	 */
	redirectCode?: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
	/**
	 * Allows to specify data that will be passed with the 404 error, like a
	 * "This page isn't available in your language" message.
	 */
	notFound?: string | App.Error;
};

/**
 * Validates the current page URL.
 * Throws a 404 error if there is no version of the page for the locale.
 * Redirects to a corrected URL if necessary.
 * @param currentUrl - Current URL from the `load()` function.
 * @param options.redirectCode Default: 301. Which HTTP code to use when redirecting to a corrected localized URL.
 * @param options.notFound Allows to specify data that will be passed with the 404 error, like a
 *      "This page isn't available in your language" message.
 * @see {@link HttpError}, {@link Redirect}
 */
export function validatePage(page: LocalizedPage, options?: ValidatePageOptions) {
	const locale = getLocaleFromUrl(page._url);
	const [status, correctPath] = checkPage(page, locale);
	if (status === PageCheckResult.Success) {
		return;
	}

	if (status === PageCheckResult.Corrected) {
		throw redirect(options?.redirectCode ?? 301, correctPath as string);
	}

	// not available for this locale
	throw error(404, options?.notFound);
}
