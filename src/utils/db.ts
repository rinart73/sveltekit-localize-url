import type { Locales } from '$i18n/i18n-types.js';

// Simulates DB
const posts = [
	{
		id: 1,
		titles: {
			en: 'First post',
			de: 'Erster Beitrag',
			it: 'Primo post',
			ru: 'Первый пост'
		},
		slugs: {
			en: 'first-post',
			de: 'erster-beitrag',
			it: 'primo-post',
			ru: 'perviy-post'
		},
		contents: {
			en: 'First post says hello!',
			de: 'Erster Beitrag sagt Hallo!',
			it: 'Il primo post ti saluta!',
			ru: 'Первый пост говорит привет!'
		}
	},
	{
		id: 2,
		titles: {
			en: 'Second post',
			de: 'Zweiter Beitrag',
			it: 'Secondo post',
			ru: 'Второй пост'
		},
		slugs: {
			en: 'second-post',
			de: 'zweiter-beitrag',
			it: 'secondo-post',
			ru: 'vtoroy-post'
		},
		contents: {
			en: 'Second post says hello!',
			de: 'Zweiter Beitrag sagt Hallo!',
			it: 'Il secondo post ti saluta!',
			ru: 'Второй пост говорит привет!'
		}
	},
	{
		id: 3,
		titles: {
			en: 'English-only post'
		},
		slugs: {
			en: 'english-only-post'
		},
		contents: {
			en: 'English-only post says hello!'
		}
	}
];

export type Post = {
	id: number;
	title: string;
	content: string;
	slugs: Partial<Record<string, string>>;
	locale: Locales;
};

export async function getPostsByLocale(locale: Locales): Promise<Post[]> {
	const results: Post[] = [];
	for (const post of posts) {
		if (!(locale in post.slugs)) continue;

		results.push({
			id: post.id,
			title: post.titles[locale] as string,
			content: post.contents[locale] as string,
			slugs: post.slugs,
			locale
		});
	}

	return results;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
	for (const post of posts) {
		for (const [locale, postSlug] of Object.entries(post.slugs)) {
			if (postSlug !== slug) continue;

			return {
				id: post.id,
				title: post.titles[locale as Locales] as string,
				content: post.contents[locale as Locales] as string,
				slugs: post.slugs,
				locale: locale as Locales
			};
		}
	}
}
