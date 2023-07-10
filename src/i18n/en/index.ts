import type { BaseTranslation } from '../i18n-types.js';

const en = {
	log: "This log was called from '{fileName:string}'",
	site: {
		name: 'Localize URL'
	},
	pageHome: {
		title: 'Home page',
		welcome: 'Welcome to the home page',
		apiDescription: 'API calls that are not affected by the library',
		spectators: '{0} live spectator{{s}}',
		legend: {
			title: 'Legend',
			correct: 'Correct link',
			fallback: 'Fallback link (leads to another locale)',
			vary: 'Correct link (only visible for supported locales)',
			redirect: 'Mismatched link, redirect',
			error: 'Not available for this locale'
		}
	},
	pageAbout: {
		title: 'About',
		text: 'About us page says hello.'
	},
	pageEnglish: {
		title: 'English-only page',
		text: 'This page is only available in English.'
	},
	pageNews: {
		title: 'News'
	},
	pageError: {
		title404: 'Page Not Found',
		titleOffline: "It looks like you're offline",
		titleOther: 'Yikes!',
		message404: "Sorry, we weren't able to find the requested page.",
		messageNotTranslated: "Sorry, this page isn't available in your language.",
		messageOffline: "Reload the page once you've found the internet.",
		messageOther: 'Please try reloading the page.',
		actionHome: 'Return to home page',
		actionBaseLocale: 'Show this page in English'
	}
} satisfies BaseTranslation;

export default en;
