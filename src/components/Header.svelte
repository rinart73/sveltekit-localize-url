<script lang="ts">
	import { page } from '$app/stores';
	import LL, { locale } from '$i18n/i18n-svelte.js';
	import { getLocaleHomeHref, href, wrapHref } from '$lib/index.js';
	import LocaleSwitcher from './LocaleSwitcher.svelte';
</script>

<header>
	<a href={getLocaleHomeHref($locale, $page.url)}>
		<h1>{$LL.site.name()} (demo)</h1>
	</a>

	<ul class="menu">
		<li>
			<!-- An mismatched href that will be fixed and redirected. Don't do this. -->
			<a class="link-hint link-hint--redirect" href="/{$locale}/about"
				>{$LL.pageAbout.title()} (1)</a
			>
		</li>
		<li>
			<!-- Normal localized href. Use `href` function when you know that the page is available for all locales
                or when you specify the `fallbackLocales` argument. -->
			<a
				class="link-hint link-hint--success"
				href={href($page.data.LP, $locale, '/[l_about]')}>{$LL.pageAbout.title()} (2)</a
			>
		</li>
		<li>
			<!-- English: A mismatched href that will be corrected.
                Non-English: 404 error due to the page not being available for a requested locale.
                Don't do this. -->
			<a
				class="link-hint"
				class:link-hint--redirect={$locale === 'en'}
				class:link-hint--error={$locale !== 'en'}
				href="/{$locale}/about/english-only">{$LL.pageEnglish.title()} (3)</a
			>
		</li>
		<!--  Try to use a requested locale. If it's not possible, don't show the element at all. -->
		{@html wrapHref(
			$page.data.LP,
			$locale,
			'/[l_about]/[l_english]',
			`<li><a class="link-hint link-hint--vary" href="%href%">${$LL.pageEnglish.title()} (4)</a></li>`
		)}
		<!-- Try to use a requested locale. If it's not possible, use the `baseLocale` as a fallback instead. -->
		{@html wrapHref(
			$page.data.LP,
			$locale,
			'/[l_about]/[l_english]',
			`<li><a class="link-hint ${
				$locale === 'en' ? 'link-hint--success' : 'link-hint--fallback'
			}" href="%href%">${$LL.pageEnglish.title()} (5)</a></li>`,
			true
		)}
		<!-- Normal localized href -->
		<li>
			<a class="link-hint link-hint--success" href={href($page.data.LP, $locale, '/[l_news]')}
				>{$LL.pageNews.title()} (6)</a
			>
		</li>
	</ul>

	<LocaleSwitcher />
</header>
