import { getPostsByLocale } from '$utils/db.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals: { locale, LL } }) => {
	console.info(LL.log({ fileName: 'routes/[[lang=lang]]/[l_news=l_news]/+page.server.ts' }));

	return {
		posts: await getPostsByLocale(locale)
	};
};
