import { localizeParam, matchParam } from '$lib/index.js';
import type { ParamMatcher } from '@sveltejs/kit';

const localizedParam = localizeParam(1, 'l_about', {
	en: 'about-project',
	de: 'uber-projekt',
	it: 'sul-progetto',
	ru: 'o-proekte'
});

export const match: ParamMatcher = (param) => matchParam(param, localizedParam);
