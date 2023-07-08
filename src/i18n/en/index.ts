import type { BaseTranslation } from '../i18n-types.js';

const en = {
	log: "This log was called from '{fileName:string}'",
	site: {
		name: 'Localize URL'
	},
	header: {
		incorrectUrl: 'Incorrect URL',
		onlyVisibleInEnglish: 'Only visible in English',
		fallback: 'Fallback URL'
	},
	pageHome: {
		title: 'Home page',
		welcome: 'Welcome to the home page',
		spectators: '{0} live spectator{{s}}'
	},
	pageAbout: {
		title: 'About project'
	},
	pagePartial: {
		title: 'Partially translated page',
		text: 'This page is only available in English.'
	},
	pageNews: {
		title: 'News',
		posts: 'Posts'
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
