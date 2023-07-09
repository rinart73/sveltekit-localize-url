import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	PageCheckResult,
	buildAlternateLinks,
	checkPage,
	getLocaleFromUrl,
	getLocaleHomeHref,
	getPageParams,
	href,
	initLocalizeUrl,
	localizePage,
	localizeParam,
	matchParam,
	resetSettings,
	setPageParam,
	validatePage,
	wrapHref
} from '$lib/index.js';
import { HttpError, Redirect } from '@sveltejs/kit';

const initDefault = () => {
	initLocalizeUrl({
		baseLocale: 'en',
		locales: ['en', 'ru']
	});
};

const initBasePrefix = () => {
	initLocalizeUrl({
		baseLocale: 'en',
		locales: ['en', 'ru'],
		addBaseLocaleToPath: true
	});
};

const initHosts = () => {
	initLocalizeUrl({
		baseLocale: 'en',
		locales: ['en', 'ru', 'it'],
		localeHosts: {
			en: 'foo.com',
			ru: 'foo.ru'
		}
	});
};

console.error = () => {
	// Suppress console.error messages
};
// But track when it's called
const consoleError = vi.spyOn(console, 'error');

describe('initLocalizeUrl', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
	});
	it('with prefix except for the base locale', () => {
		initDefault();
		expect(getLocaleHomeHref('en', new URL('http://foo.com'))).toBe('http://foo.com/');
		expect(getLocaleHomeHref('ru', new URL('http://foo.com'))).toBe('http://foo.com/ru');
	});
	it('with prefix for every locale', () => {
		initBasePrefix();
		expect(getLocaleHomeHref('en', new URL('http://foo.com'))).toBe('http://foo.com/en');
		expect(getLocaleHomeHref('ru', new URL('http://foo.com'))).toBe('http://foo.com/ru');
	});
	it('with separate hosts per locale', () => {
		initHosts();
		expect(getLocaleHomeHref('en', new URL('http://foo.com'))).toBe('http://foo.com/');
		expect(getLocaleHomeHref('ru', new URL('http://foo.com'))).toBe('http://foo.ru/');
		expect(getLocaleHomeHref('it', new URL('http://foo.com'))).toBe('http://foo.com/it');
	});
	it('with separate hosts per locale, but without baseLocale host throws', () => {
		expect(() => {
			initLocalizeUrl({
				baseLocale: 'en',
				locales: ['en', 'ru'],
				localeHosts: {
					ru: 'foo.ru'
				}
			});
		}).toThrowError();
	});
	it('is processed only once', () => {
		initLocalizeUrl({
			baseLocale: 'en',
			locales: ['en', 'ru'],
			addBaseLocaleToPath: true
		});
		initLocalizeUrl({
			baseLocale: 'en',
			locales: ['en', 'ru'],
			addBaseLocaleToPath: false
		});
		expect(getLocaleHomeHref('en', new URL('http://foo.com/'))).toBe('http://foo.com/en');
	});
});

describe('getLocaleFromUrl', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
	});
	it('from pathname prefix', () => {
		initDefault();
		expect(getLocaleFromUrl(new URL('http://foo.com/'))).toBe('en');
		expect(getLocaleFromUrl(new URL('http://foo.com/en'))).toBe('en');
		expect(getLocaleFromUrl(new URL('http://foo.com/ru'))).toBe('ru');
		expect(getLocaleFromUrl(new URL('http://foo.com/zz'))).toBe('en');
	});
	it('from pathname prefix or host', () => {
		initHosts();
		expect(getLocaleFromUrl(new URL('http://foo.com/'))).toBe('en');
		expect(getLocaleFromUrl(new URL('http://foo.com/en'))).toBe('en');
		expect(getLocaleFromUrl(new URL('http://foo.com/ru'))).toBe('ru');
		expect(getLocaleFromUrl(new URL('http://foo.ru/'))).toBe('ru');
		expect(getLocaleFromUrl(new URL('http://foo.ru/en'))).toBe('en');
		expect(getLocaleFromUrl(new URL('http://foo.com/it'))).toBe('it');
	});
});

describe('localizeParam', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
		initDefault();
	});
	it('works', () => {
		const localizedParam = localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas'
		});
		expect(matchParam('about-us', localizedParam)).toBeTruthy();
		expect(matchParam('o-nas', localizedParam)).toBeTruthy();
		expect(matchParam('about', localizedParam)).toBeFalsy();
	});
});

describe('localizePage', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
		initDefault();
	});
	it('catches route params', () => {
		const LP = localizePage(
			new URL('http://foo.com/about/fixed/bar'),
			'/[[lang=lang]]/[l_about=l_about]/fixed/[[optional]]'
		);
		expect(LP._paramPositions).toMatchObject(
			new Map([
				['l_about', 1],
				['optional', 3]
			])
		);
	});
	it('accepts custom params', () => {
		const LP = localizePage(
			new URL('http://foo.com/news/first-post'),
			'/[[lang=lang]]/[l_news=l_news]/[post]'
		);
		setPageParam(LP, 'post', {
			en: 'first-post',
			ru: 'pervyi-post'
		});
		const param = {
			name: 'post',
			position: 2,
			values: {
				en: 'first-post',
				ru: 'pervyi-post'
			}
		};
		expect(LP._customParams).toMatchObject(new Map([['post', param]]));
		expect(getPageParams(LP, true)).toMatchObject([param]);
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	it('prints an error when given unused custom params', () => {
		const LP = localizePage(new URL('http://foo.com/about'), '/[[lang=lang]]');
		setPageParam(LP, 'post', {
			en: 'first-post',
			ru: 'pervyi-post'
		});
		expect(consoleError).toHaveBeenCalledOnce();
	});
});

describe('href', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
	});
	it('supports basic pathnames', () => {
		initDefault();
		const LP = localizePage(new URL('http://foo.com/'), '/[[lang=lang]]');
		expect(href(LP, 'ru', '/')).toBe('http://foo.com/ru');
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	it('supports localized params', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas'
		});
		const LP = localizePage(new URL('http://foo.com/'), '/[[lang=lang]]');
		expect(href(LP, 'ru', '/[l_about]')).toBe('http://foo.com/ru/o-nas');
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	it('supports custom params', () => {
		initDefault();
		localizeParam(1, 'l_news', {
			en: 'news',
			ru: 'novosti'
		});
		const LP = localizePage(
			new URL('http://foo.com/ru/novosti/pervyi-post'),
			'/[[lang=lang]]/[l_news=l_news]/[post]'
		);
		setPageParam(LP, 'post', {
			en: 'first-post',
			ru: 'pervyi-post'
		});
		expect(href(LP, 'en', '/[l_news]/[post]/edit')).toBe('http://foo.com/news/first-post/edit');
		expect(
			href(LP, 'en', {
				base: '/replaced/replaced/edit',
				params: ['l_news', 'post']
			})
		).toBe('http://foo.com/news/first-post/edit');
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	it("prints an error when pathname param isn't registered", () => {
		initDefault();
		const LP = localizePage(new URL('http://foo.com/'), '/[[lang=lang]]');
		expect(href(LP, 'ru', '/[post]')).toBe('');
		expect(
			href(LP, 'ru', {
				base: '/ru/anything',
				params: ['l_none']
			})
		).toBe('');
		expect(consoleError).toHaveBeenCalledTimes(2);
	});
	it('prints an error when pathname param is in the wrong position', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas'
		});
		const LP = localizePage(new URL('http://foo.com/'), '/[[lang=lang]]');
		expect(href(LP, 'ru', '/bar/[l_about]')).toBe('');
		expect(consoleError).toHaveBeenCalledOnce();
	});
	it('supports fallback', () => {
		initDefault();
		localizeParam(1, 'l_partial', {
			en: 'partial',
			de: 'teilweise'
		});
		const LP = localizePage(new URL('http://foo.com/'), '/[[lang=lang]]');
		expect(href(LP, 'ru', '/[l_partial]')).toBe('');
		expect(href(LP, 'ru', '/[l_partial]', true)).toBe('http://foo.com/partial');
		expect(href(LP, 'ru', '/[l_partial]', 'de')).toBe('http://foo.com/de/teilweise');
		expect(href(LP, 'ru', '/[l_partial]', ['it', 'de'])).toBe('http://foo.com/de/teilweise');
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	it('supports locale hosts', () => {
		initHosts();
		localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas',
			it: 'chi-siamo'
		});
		const LP = localizePage(new URL('http://foo.com/'), '/[[lang=lang]]');
		expect(href(LP, 'en', '/[l_about]')).toBe('http://foo.com/about-us');
		expect(href(LP, 'ru', '/[l_about]')).toBe('http://foo.ru/o-nas');
		expect(href(LP, 'it', '/[l_about]')).toBe('http://foo.com/it/chi-siamo');
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
});

describe('wrapHref', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
	});
	it('works', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us'
		});
		const LP = localizePage(new URL('http://foo.com/'), '/[[lang=lang]]');
		expect(wrapHref(LP, 'en', '/[l_about]', '<a href="%href%">test</a>')).toBe(
			'<a href="http://foo.com/about-us">test</a>'
		);
		expect(wrapHref(LP, 'ru', '/[l_about]', '<a href="%href%">test</a>')).toBe('');
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
});

describe('buildAlternateLinks', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
	});
	it('builds hreflang and switcher when page has no errors', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas'
		});
		const LP = localizePage(new URL('http://foo.com/ru/o-nas'), '/[[lang=lang]]/[l_about]');
		buildAlternateLinks(LP);
		expect(consoleError).toHaveBeenCalledTimes(0);
		const expected = new Map([
			['en', 'http://foo.com/about-us'],
			['ru', 'http://foo.com/ru/o-nas']
		]);
		expect(LP.hreflang).toMatchObject(expected);
		expect(LP.switcher).toMatchObject(expected);
	});
	it('builds only switcher for pages that have an error', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas'
		});
		const LP = localizePage(new URL('http://foo.com/ru/o-nas'), '/[[lang=lang]]/[l_about]');
		buildAlternateLinks(LP, true);
		expect(LP.hreflang).toMatchObject(new Map());
		expect(LP.switcher).toMatchObject(
			new Map([
				['en', 'http://foo.com/'],
				['ru', 'http://foo.com/ru']
			])
		);
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	it('builds partial hreflang and switcher with homepage fallback for partially localized params', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us'
		});
		const LP = localizePage(new URL('http://foo.com/ru/o-nas'), '/[[lang=lang]]/[l_about]');
		buildAlternateLinks(LP);
		expect(LP.hreflang).toMatchObject(new Map([['en', 'http://foo.com/about-us']]));
		expect(LP.switcher).toMatchObject(
			new Map([
				['en', 'http://foo.com/about-us'],
				['ru', 'http://foo.com/ru']
			])
		);
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
});

describe('checkPage', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
	});
	it('handles correct URLs', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas'
		});
		const LP = localizePage(new URL('http://foo.com/ru/o-nas'), '/[[lang=lang]]/[l_about]');
		expect(checkPage(LP, 'ru')).toMatchObject([PageCheckResult.Success]);
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	it('handles mismatched URLs', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas'
		});
		const LP = localizePage(new URL('http://foo.com/ru/about-us'), '/[[lang=lang]]/[l_about]');
		expect(checkPage(LP, 'ru')).toMatchObject([
			PageCheckResult.Corrected,
			'http://foo.com/ru/o-nas'
		]);
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	it('handles not localizeable URLs', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us'
		});
		const LP = localizePage(new URL('http://foo.com/ru/about-us'), '/[[lang=lang]]/[l_about]');
		expect(checkPage(LP, 'ru')).toMatchObject([PageCheckResult.NotLocalized]);
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
});

describe('validatePage', () => {
	afterEach(() => {
		vi.clearAllMocks();
		resetSettings();
	});
	it('handles correct URLs', () => {
		initDefault();
		localizeParam(1, 'l_about', {
			en: 'about-us',
			ru: 'o-nas'
		});
		const LP = localizePage(new URL('http://foo.com/ru/o-nas'), '/[[lang=lang]]/[l_about]');
		validatePage(LP);
		expect(consoleError).toHaveBeenCalledTimes(0);
	});
	// it('handles mismatched URLs', () => {
	// 	initDefault();
	// 	localizeParam(1, 'l_about', {
	// 		en: 'about-us',
	// 		ru: 'o-nas'
	// 	});
	// 	const LP = localizePage(new URL('http://foo.com/ru/about-us'), '/[[lang=lang]]/[l_about]');
	//     expect(consoleError).toHaveBeenCalledTimes(0);
	// 	expect(validatePage(LP)).toThrow(Redirect);
	// });
	// it('handles not localizeable URLs', () => {
	// 	initDefault();
	// 	localizeParam(1, 'l_about', {
	// 		en: 'about-us'
	// 	});
	// 	const LP = localizePage(new URL('http://foo.com/ru/about-us'), '/[[lang=lang]]/[l_about]');
	//     expect(consoleError).toHaveBeenCalledTimes(0);
	// 	expect(validatePage(LP)).toThrow(HttpError);
	// });
});
