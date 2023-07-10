<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte.js';
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
	{#if data.posts}
		<ul class="center-list">
			{#each data.posts as post}
				<li
					class="link-hint"
					class:link-hint--success={post.id !== 3}
					class:link-hint--vary={post.id === 3}
				>
					<a href={href(data.LP, $locale, `/[l_news]/${post.slugs[$locale]}`)}
						>{post.title}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
	<hr />
	<ul class="center-list">
		<!-- Demonstration of how a direct link to the non-localized post is handled (it's 404). -->
		<li
			class="link-hint"
			class:link-hint--redirect={$locale === 'en'}
			class:link-hint--error={$locale !== 'en'}
		>
			<a href="/{$locale}/news/english-only-post">English-only post</a>
		</li>
	</ul>
</div>
