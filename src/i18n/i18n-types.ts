// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type {
	BaseTranslation as BaseTranslationType,
	LocalizedString,
	RequiredParams
} from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'en';

export type Locales = 'de' | 'en' | 'it' | 'ru';

export type Translation = RootTranslation;

export type Translations = RootTranslation;

type RootTranslation = {
	/**
	 * T​h​i​s​ ​l​o​g​ ​w​a​s​ ​c​a​l​l​e​d​ ​f​r​o​m​ ​'​{​f​i​l​e​N​a​m​e​}​'
	 * @param {string} fileName
	 */
	log: RequiredParams<'fileName'>;
	site: {
		/**
		 * L​o​c​a​l​i​z​e​ ​U​R​L
		 */
		name: string;
	};
	pageHome: {
		/**
		 * H​o​m​e​ ​p​a​g​e
		 */
		title: string;
		/**
		 * W​e​l​c​o​m​e​ ​t​o​ ​t​h​e​ ​h​o​m​e​ ​p​a​g​e
		 */
		welcome: string;
		/**
		 * A​P​I​ ​c​a​l​l​s​ ​t​h​a​t​ ​a​r​e​ ​n​o​t​ ​a​f​f​e​c​t​e​d​ ​b​y​ ​t​h​e​ ​l​i​b​r​a​r​y
		 */
		apiDescription: string;
		/**
		 * {​0​}​ ​l​i​v​e​ ​s​p​e​c​t​a​t​o​r​{​{​s​}​}
		 * @param {string | number | boolean} 0
		 */
		spectators: RequiredParams<'0'>;
		legend: {
			/**
			 * L​e​g​e​n​d
			 */
			title: string;
			/**
			 * C​o​r​r​e​c​t​ ​l​i​n​k
			 */
			correct: string;
			/**
			 * F​a​l​l​b​a​c​k​ ​l​i​n​k​ ​(​l​e​a​d​s​ ​t​o​ ​a​n​o​t​h​e​r​ ​l​o​c​a​l​e​)
			 */
			fallback: string;
			/**
			 * C​o​r​r​e​c​t​ ​l​i​n​k​ ​(​o​n​l​y​ ​v​i​s​i​b​l​e​ ​f​o​r​ ​s​u​p​p​o​r​t​e​d​ ​l​o​c​a​l​e​s​)
			 */
			vary: string;
			/**
			 * M​i​s​m​a​t​c​h​e​d​ ​l​i​n​k​,​ ​r​e​d​i​r​e​c​t
			 */
			redirect: string;
			/**
			 * N​o​t​ ​a​v​a​i​l​a​b​l​e​ ​f​o​r​ ​t​h​i​s​ ​l​o​c​a​l​e
			 */
			error: string;
		};
	};
	pageAbout: {
		/**
		 * A​b​o​u​t
		 */
		title: string;
		/**
		 * A​b​o​u​t​ ​u​s​ ​p​a​g​e​ ​s​a​y​s​ ​h​e​l​l​o​.
		 */
		text: string;
	};
	pageEnglish: {
		/**
		 * E​n​g​l​i​s​h​-​o​n​l​y​ ​p​a​g​e
		 */
		title: string;
		/**
		 * T​h​i​s​ ​p​a​g​e​ ​i​s​ ​o​n​l​y​ ​a​v​a​i​l​a​b​l​e​ ​i​n​ ​E​n​g​l​i​s​h​.
		 */
		text: string;
	};
	pageNews: {
		/**
		 * N​e​w​s
		 */
		title: string;
	};
	pageError: {
		/**
		 * P​a​g​e​ ​N​o​t​ ​F​o​u​n​d
		 */
		title404: string;
		/**
		 * I​t​ ​l​o​o​k​s​ ​l​i​k​e​ ​y​o​u​'​r​e​ ​o​f​f​l​i​n​e
		 */
		titleOffline: string;
		/**
		 * Y​i​k​e​s​!
		 */
		titleOther: string;
		/**
		 * S​o​r​r​y​,​ ​w​e​ ​w​e​r​e​n​'​t​ ​a​b​l​e​ ​t​o​ ​f​i​n​d​ ​t​h​e​ ​r​e​q​u​e​s​t​e​d​ ​p​a​g​e​.
		 */
		message404: string;
		/**
		 * S​o​r​r​y​,​ ​t​h​i​s​ ​p​a​g​e​ ​i​s​n​'​t​ ​a​v​a​i​l​a​b​l​e​ ​i​n​ ​y​o​u​r​ ​l​a​n​g​u​a​g​e​.
		 */
		messageNotTranslated: string;
		/**
		 * R​e​l​o​a​d​ ​t​h​e​ ​p​a​g​e​ ​o​n​c​e​ ​y​o​u​'​v​e​ ​f​o​u​n​d​ ​t​h​e​ ​i​n​t​e​r​n​e​t​.
		 */
		messageOffline: string;
		/**
		 * P​l​e​a​s​e​ ​t​r​y​ ​r​e​l​o​a​d​i​n​g​ ​t​h​e​ ​p​a​g​e​.
		 */
		messageOther: string;
		/**
		 * R​e​t​u​r​n​ ​t​o​ ​h​o​m​e​ ​p​a​g​e
		 */
		actionHome: string;
		/**
		 * S​h​o​w​ ​t​h​i​s​ ​p​a​g​e​ ​i​n​ ​E​n​g​l​i​s​h
		 */
		actionBaseLocale: string;
	};
};

export type TranslationFunctions = {
	/**
	 * This log was called from '{fileName}'
	 */
	log: (arg: { fileName: string }) => LocalizedString;
	site: {
		/**
		 * Localize URL
		 */
		name: () => LocalizedString;
	};
	pageHome: {
		/**
		 * Home page
		 */
		title: () => LocalizedString;
		/**
		 * Welcome to the home page
		 */
		welcome: () => LocalizedString;
		/**
		 * API calls that are not affected by the library
		 */
		apiDescription: () => LocalizedString;
		/**
		 * {0} live spectator{{s}}
		 */
		spectators: (arg0: string | number | boolean) => LocalizedString;
		legend: {
			/**
			 * Legend
			 */
			title: () => LocalizedString;
			/**
			 * Correct link
			 */
			correct: () => LocalizedString;
			/**
			 * Fallback link (leads to another locale)
			 */
			fallback: () => LocalizedString;
			/**
			 * Correct link (only visible for supported locales)
			 */
			vary: () => LocalizedString;
			/**
			 * Mismatched link, redirect
			 */
			redirect: () => LocalizedString;
			/**
			 * Not available for this locale
			 */
			error: () => LocalizedString;
		};
	};
	pageAbout: {
		/**
		 * About
		 */
		title: () => LocalizedString;
		/**
		 * About us page says hello.
		 */
		text: () => LocalizedString;
	};
	pageEnglish: {
		/**
		 * English-only page
		 */
		title: () => LocalizedString;
		/**
		 * This page is only available in English.
		 */
		text: () => LocalizedString;
	};
	pageNews: {
		/**
		 * News
		 */
		title: () => LocalizedString;
	};
	pageError: {
		/**
		 * Page Not Found
		 */
		title404: () => LocalizedString;
		/**
		 * It looks like you're offline
		 */
		titleOffline: () => LocalizedString;
		/**
		 * Yikes!
		 */
		titleOther: () => LocalizedString;
		/**
		 * Sorry, we weren't able to find the requested page.
		 */
		message404: () => LocalizedString;
		/**
		 * Sorry, this page isn't available in your language.
		 */
		messageNotTranslated: () => LocalizedString;
		/**
		 * Reload the page once you've found the internet.
		 */
		messageOffline: () => LocalizedString;
		/**
		 * Please try reloading the page.
		 */
		messageOther: () => LocalizedString;
		/**
		 * Return to home page
		 */
		actionHome: () => LocalizedString;
		/**
		 * Show this page in English
		 */
		actionBaseLocale: () => LocalizedString;
	};
};

export type Formatters = {};
