import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url, locals: { LL } }) => {
	// no real data, just a simulation ;)
	const oldSpectators = Number(url.searchParams.get('oldSpectators') ?? '0');
	let spectators = oldSpectators * 2 + 1;
	if (spectators > 100_000) {
		spectators = 0;
	}

	console.info(LL.log({ fileName: 'routes/api/+server.ts' }));

	return json({ spectators });
};
