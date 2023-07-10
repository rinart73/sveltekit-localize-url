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
	<h3>{$LL.pageHome.legend.title()}</h3>
	<ul class="center-list">
		<li class="link-hint link-hint--success">{$LL.pageHome.legend.correct()}</li>
		<li class="link-hint link-hint--fallback">{$LL.pageHome.legend.fallback()}</li>
		<li class="link-hint link-hint--vary">{$LL.pageHome.legend.vary()}</li>
		<li class="link-hint link-hint--redirect">{$LL.pageHome.legend.redirect()}</li>
		<li class="link-hint link-hint--error">{$LL.pageHome.legend.error()}</li>
	</ul>
	<h3>{$LL.pageHome.apiDescription()}</h3>
	<p>{$LL.pageHome.spectators(spectators)}</p>
</div>
