<script lang="ts">
	import { baseLocale } from '$i18n/i18n-util.js';
	import { page } from '$app/stores';
	import { buildAlternateLinks } from '$lib/index.js';
</script>

<!-- Error pages shouldn't have hreflang -->
{#if !$page.error}
	<!-- Alternate links are generated on-demand. So we need to call the `buildAlternateLinks` -->
	{#each buildAlternateLinks($page.data.LP).hreflang as [hreflang, href]}
		<link rel="alternate" {hreflang} {href} />
	{/each}
	<!-- After they're generated you can reference them normally -->
	<link rel="alternate" hreflang="x-default" href={$page.data.LP.hreflang.get(baseLocale)} />
	<link rel="canonical" href={$page.data.LP.hreflang.get($page.data.locale)} />
{/if}
