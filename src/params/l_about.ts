import { localizeParam, matchParam } from '$lib/index.js';
import type { ParamMatcher } from '@sveltejs/kit';

const localizedParam = localizeParam(1, 'l_about', {
	en: 'about',
	de: 'uber-uns',
	it: 'chi-samo',
	ru: 'o-nas'
});

export const match: ParamMatcher = (param) => matchParam(param, localizedParam);
