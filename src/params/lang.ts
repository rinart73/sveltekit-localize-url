import { isLocale } from '$i18n/i18n-util.js';
import type { ParamMatcher } from '@sveltejs/kit';

// only accept valid languages as a segment in the URL
export const match: ParamMatcher = (param) => isLocale(param);
