<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte.js';
	import { page } from '$app/stores';
	import { getLocaleHomeHref } from '$lib/index.js';

	// we don't want to use <svelte:window bind:online> here, because we only care about the online
	// state when the page first loads
	let online = typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

{#if $page.status === 404}
	<h1>{$LL.pageError.title404()}</h1>
	<p>
		{#if !$page.error?.message || $page.error?.message === 'Not Found'}
			{$LL.pageError.message404()}
		{:else}
			{$page.error?.message}
		{/if}
	</p>
{:else if !online}
	<h1>{$LL.pageError.titleOffline()}</h1>
	<p>{$LL.pageError.messageOffline()}</p>
{:else}
	<h1>{$LL.pageError.titleOther()}</h1>
	<p>
		{#if !$page.error?.message || $page.error?.message === 'Internal Error'}
			{$LL.pageError.messageOther()}
		{:else}
			{$page.error?.message}
		{/if}
	</p>
{/if}

{#if $page.status === 404 || online}
	<p>
		{#if $page.error?.link}
			<a href={$page.error.link}>{$page.error.linkText}</a>
			/
		{/if}
		<a href={getLocaleHomeHref($locale, $page.url)}>{$LL.pageError.actionHome()}</a>
	</p>
{/if}
