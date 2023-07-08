import { localizeParam, matchParam } from '$lib/index.js';
import type { ParamMatcher } from '@sveltejs/kit';

const localizedParam = localizeParam(2, 'l_partial', {
	en: 'partial'
});

export const match: ParamMatcher = (param) => matchParam(param, localizedParam);
