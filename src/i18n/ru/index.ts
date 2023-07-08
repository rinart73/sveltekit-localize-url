import en from '$i18n/en/index.js';
import type { Translation } from '../i18n-types.js';

const ru = {
	// Fallback
	...(en as Translation),

	log: "Этот лог был вызван из '{fileName}'",
	site: {
		name: 'Localize URL'
	},
	header: {
		incorrectUrl: 'Неверный URL',
		onlyVisibleInEnglish: '',
		fallback: 'Резервный URL'
	},
	pageHome: {
		title: 'Главная страница',
		welcome: 'Добро пожаловать на главную страницу',
		spectators: '{0} зрител{{ей|ь|я|я|ей}} онлайн'
	},
	pageAbout: {
		title: 'О проекте'
	},
	pageNews: {
		title: 'Новости',
		posts: 'Посты'
	},
	pageError: {
		title404: 'Страница не найдена',
		titleOffline: 'Похоже, вы не в сети',
		titleOther: 'Ой!',
		message404: 'К сожалению, мы не смогли найти запрошенную страницу.',
		messageNotTranslated: 'К сожалению, эта страница недоступна на вашем языке.',
		messageOffline: 'Перезагрузите страницу, как только ваше соединение восстановится.',
		messageOther: 'Пожалуйста, попробуйте перезагрузить страницу.',
		actionHome: 'Вернуться на главную страницу',
		actionBaseLocale: 'Показать эту страницу на английском языке'
	}
} satisfies Translation;

export default ru;
