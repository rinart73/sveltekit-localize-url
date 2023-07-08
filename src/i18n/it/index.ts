import en from '$i18n/en/index.js';
import type { Translation } from '../i18n-types.js';

const it = {
	// Fallback
	...(en as Translation),

	log: "Questa protocollazione è stata chiamata da '{fileName}'",
	site: {
		name: 'Localize URL'
	},
	header: {
		incorrectUrl: 'URL errato',
		onlyVisibleInEnglish: '',
		fallback: 'URL di riserva'
	},
	pageHome: {
		title: 'Pagina iniziale',
		welcome: 'Benvenuti nella home page',
		spectators: '{0} {{spettatore|spettatori}} in diretta'
	},
	pageAbout: {
		title: 'A proposito di progetto'
	},
	pageNews: {
		title: 'Notizia',
		posts: 'Messaggi'
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
