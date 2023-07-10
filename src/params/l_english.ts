import { localizeParam, matchParam } from '$lib/index.js';
import type { ParamMatcher } from '@sveltejs/kit';

const localizedParam = localizeParam(2, 'l_english', {
	en: 'english-only'
});

export const match: ParamMatcher = (param) => matchParam(param, localizedParam);
