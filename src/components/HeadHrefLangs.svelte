<script lang="ts">
	import { baseLocale } from '$i18n/i18n-util.js';
	import { page } from '$app/stores';
	import { buildAlternateLinks } from '$lib/index.js';
</script>

{#if !$page.error}
	{#each buildAlternateLinks($page.data.LP).hreflang as [hreflang, href]}
		<link rel="alternate" {hreflang} {href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={$page.data.LP.hreflang.get(baseLocale)} />
	<link rel="canonical" href={$page.data.LP.hreflang.get($page.data.locale)} />
{/if}
