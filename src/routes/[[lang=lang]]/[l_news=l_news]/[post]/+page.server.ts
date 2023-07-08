import { getPostBySlug } from '$utils/db.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, locals: { LL } }) => {
	console.info(
		LL.log({ fileName: 'routes/[[lang=lang]]/[l_news=l_news]/[post]/+page.server.ts' })
	);

	return {
		post: await getPostBySlug(params.post)
	};
};
