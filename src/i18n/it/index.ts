import en from '$i18n/en/index.js';
import type { Translation } from '../i18n-types.js';

const it = {
	// Fallback
	...(en as Translation),

	log: "Questa protocollazione è stata chiamata da '{fileName}'",
	site: {
		name: 'Localize URL'
	},
	pageHome: {
		title: 'Pagina iniziale',
		welcome: 'Benvenuti nella home page',
		apiDescription: 'Chiamate API che non sono interessate dalla libreria',
		spectators: '{0} {{spettatore|spettatori}} in diretta',
		legend: {
			title: 'Leggenda',
			correct: 'Collegamento corretto',
			fallback: "Collegamento di fallback (conduce a un'altra località)",
			vary: 'Collegamento corretto (visibile solo per le impostazioni locali supportate)',
			redirect: 'Collegamento non corrispondente, reindirizzamento',
			error: 'Non disponibile per questa lingua'
		}
	},
	pageAbout: {
		title: 'Chi siamo',
		text: 'La pagina Chi siamo saluta.'
	},
	pageEnglish: {
		title: 'Pagina solo in inglese',
		text: ''
	},
	pageNews: {
		title: 'Notizia'
	},
	pageError: {
		title404: 'Pagina non trovata',
		titleOffline: 'Sembra che tu sia offline',
		titleOther: 'Accidenti!',
		message404: 'Spiacenti, non siamo riusciti a trovare la pagina richiesta.',
		messageNotTranslated: 'Siamo spiacenti, questa pagina non è disponibile nella tua lingua.',
		messageOffline: 'Ricarica la pagina dopo aver trovato Internet.',
		messageOther: 'Prova a ricaricare la pagina.',
		actionHome: 'Ritorna alla pagina iniziale',
		actionBaseLocale: 'Mostra questa pagina in inglese'
	}
} satisfies Translation;

export default it;
