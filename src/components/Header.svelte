<script lang="ts">
	import { page } from '$app/stores';
	import LL, { locale } from '$i18n/i18n-svelte.js';
	import { getLocaleHomeHref, href, wrapHref } from '$lib/index.js';
	import LocaleSwitcher from './LocaleSwitcher.svelte';
</script>

<header>
	<a href={getLocaleHomeHref($locale, $page.url)}>
		<h1>{$LL.site.name()}</h1>
	</a>

	<ul class="menu">
		<li>
			<a href="/{$locale}/about-project"
				>{`${$LL.pageAbout.title()} (${$LL.header.incorrectUrl()})`}</a
			>
		</li>
		<li>
			<a href={href($page.data.LP, $locale, '/[l_about]')}>{$LL.pageAbout.title()}</a>
		</li>
		<li>
			<a href="/{$locale}/about-project/partial"
				>{`${$LL.pagePartial.title()} (${$LL.header.incorrectUrl()})`}</a
			>
		</li>
		{@html wrapHref(
			$page.data.LP,
			$locale,
			'/[l_about]/[l_partial]',
			`<li><a href="%href%">${$LL.pagePartial.title()} (${$LL.header.onlyVisibleInEnglish()})</a></li>`
		)}
		{@html wrapHref(
			$page.data.LP,
			$locale,
			'/[l_about]/[l_partial]',
			`<li><a href="%href%">${$LL.pagePartial.title()} (${$LL.header.fallback()})</a></li>`,
			true
		)}
		<li>
			<a href={href($page.data.LP, $locale, '/[l_news]')}>{$LL.pageNews.title()}</a>
		</li>
	</ul>

	<LocaleSwitcher />
</header>
