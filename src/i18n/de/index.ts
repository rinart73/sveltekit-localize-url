import en from '$i18n/en/index.js';
import type { Translation } from '../i18n-types.js';

const de = {
	// Fallback
	...(en as Translation),

	log: "Dieses Logging wurde von '{fileName}' aufgerufen",
	site: {
		name: 'Localize URL'
	},
	pageHome: {
		title: 'Startseite',
		welcome: 'Willkommen auf der Homepage',
		apiDescription: 'API-Aufrufe, die nicht von der Bibliothek betroffen sind',
		spectators: '{0} Zuschauer live',
		legend: {
			title: 'Legende',
			correct: 'Richtiger Link',
			fallback: 'Fallback-Link (führt zu einem anderen Gebietsschema)',
			vary: 'Richtiger Link (nur für unterstützte Gebietsschemas sichtbar)',
			redirect: 'Nicht übereinstimmender Link, Weiterleitung',
			error: 'Für dieses Gebietsschema nicht verfügbar'
		}
	},
	pageAbout: {
		title: 'Über uns',
		text: 'Über uns Seite sagt Hallo.'
	},
	pageEnglish: {
		title: 'Seite nur auf Englisch',
		text: ''
	},
	pageNews: {
		title: 'Nachricht'
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
