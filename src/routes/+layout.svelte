<script lang="ts">
	import '../styles/global.scss';

	import { page } from '$app/stores';
	import LL, { setLocale } from '$i18n/i18n-svelte.js';
	import Header from '$components/Header.svelte';
	import HeadHrefLangs from '$components/HeadHrefLangs.svelte';
	import type { LayoutData } from './$types.js';

	export let data: LayoutData;
	// at the very top, set the locale before you access the store and before the actual rendering takes place
	setLocale(data.locale);

	console.info($LL.log({ fileName: 'routes/+layout.svelte' }));
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<a href="https://github.com/rinart73/sveltekit-localize-url" target="_blank"
		><strong>Github:</strong> Localize URL</a
	>
</footer>

<svelte:head>
	<title>{$page.data.title || $LL.site.name()}</title>
	<HeadHrefLangs />
</svelte:head>
