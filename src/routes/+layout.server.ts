import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = ({ locals: { locale, LL } }) => {
	console.info(LL.log({ fileName: 'routes/+layout.server.ts' }));

	// pass locale information from "server-context" to "shared server + client context"
	return { locale };
};
