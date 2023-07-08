<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { setLocale, locale } from '$i18n/i18n-svelte.js';
	import type { Locales } from '$i18n/i18n-types.js';
	import { loadLocaleAsync } from '$i18n/i18n-util.async.js';
	import { buildAlternateLinks, getLocaleFromUrl } from '$lib/index.js';

	const switchLocale = async (newLocale: Locales) => {
		if (!newLocale || $locale === newLocale) return;

		// load new dictionary from server
		await loadLocaleAsync(newLocale);

		// select locale
		setLocale(newLocale);

		// run the `load` function again
		invalidateAll();
	};

	// update `lang` attribute
	$: browser && document.querySelector('html')?.setAttribute('lang', $locale);

	// update locale when page store changes
	$: if (browser) {
		const lang = getLocaleFromUrl($page.url) as Locales;
		switchLocale(lang);
	}
</script>

<ul class="switcher">
	{#each buildAlternateLinks($page.data.LP, $page.error).switcher as [lang, href]}
		<li>
			<a class:active={lang === $locale} href="{href}{$page.url.hash}">
				{lang}
			</a>
		</li>
	{/each}
</ul>
