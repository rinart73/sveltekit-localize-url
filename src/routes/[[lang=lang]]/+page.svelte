<script lang="ts">
	import LL from '$i18n/i18n-svelte.js';
	import { onMount } from 'svelte';

	console.info($LL.log({ fileName: 'routes/[[lang=lang]]/+page.svelte' }));

	let spectators = 0;

	onMount(() => {
		const interval = setInterval(updateSpectatorCount, 5_000);

		return () => clearInterval(interval);
	});

	const updateSpectatorCount = async () => {
		const response = await fetch(
			'/api/spectators?' +
				new URLSearchParams({ oldSpectators: spectators.toString() }).toString()
		);
		const result = await response.json();
		spectators = result.spectators;
	};
</script>

<h2>
	{$LL.pageHome.welcome()}
</h2>

<div class="content">
	{$LL.pageHome.spectators(spectators)}
</div>
