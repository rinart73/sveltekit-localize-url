import { localizeParam, matchParam } from '$lib/index.js';
import type { ParamMatcher } from '@sveltejs/kit';

const localizedParam = localizeParam(1, 'l_news', {
	en: 'news',
	de: 'nachricht',
	it: 'notizia',
	ru: 'novosti'
});

export const match: ParamMatcher = (param) => matchParam(param, localizedParam);
