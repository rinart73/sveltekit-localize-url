import en from '$i18n/en/index.js';
import type { Translation } from '../i18n-types.js';

const de = {
	// Fallback
	...(en as Translation),

	log: "Dieses Logging wurde von '{fileName}' aufgerufen",
	site: {
		name: 'Localize URL'
	},
	header: {
		incorrectUrl: 'Falsche URL',
		onlyVisibleInEnglish: '',
		fallback: 'Fallback-URL'
	},
	pageHome: {
		title: 'Startseite',
		welcome: 'Willkommen auf der Homepage',
		spectators: '{0} Zuschauer live'
	},
	pageAbout: {
		title: 'Über das Projekt'
	},
	pageNews: {
		title: 'Nachricht',
		posts: 'Beiträge'
	},
	pageError: {
		title404: 'Seite nicht gefunden',
		titleOffline: 'Es sieht so aus, als wären Sie offline',
		titleOther: 'Huch!',
		message404: 'Leider konnten wir die gewünschte Seite nicht finden.',
		messageNotTranslated: 'Leider ist diese Seite noch nicht in Ihrer Sprache verfügbar.',
		messageOffline: 'Laden Sie die Seite neu, sobald Sie das Internet gefunden haben.',
		messageOther: 'Bitte versuchen Sie, die Seite neu zu laden.',
		actionHome: 'Zur Startseite zurückkehren',
		actionBaseLocale: 'Diese Seite auf Englisch anzeigen'
	}
} satisfies Translation;

export default de;
