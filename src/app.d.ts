// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Locales, TranslationFunctions } from '$i18n/i18n-types.ts';

declare global {
	namespace App {
		interface Error {
			message: string;
			link?: string;
			linkText?: string;
		}

		interface Locals {
			locale: Locales;
			LL: TranslationFunctions;
		}

		// interface Platform {}
	}
}

export {};
