<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte.js';
	import { page } from '$app/stores';
	import { href } from '$lib/index.js';

	export let data;

	console.info(
		$LL.log({
			fileName: 'routes/[[lang=lang]]/[l_news=l_news]/+page.svelte'
		})
	);
</script>

<h2>
	{$LL.pageNews.title()}
</h2>
<div class="content">
	<h3>{$LL.pageNews.posts()}</h3>

	{#if data.posts}
		{#each data.posts as post}
			<article>
				<a href={href(data.LP, $locale, `/[l_news]/${post.slugs[$locale]}`)}>{post.title}</a
				>
			</article>
		{/each}
	{/if}
</div>
