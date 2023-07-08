<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte.js';
	import { page } from '$app/stores';
	import { href } from '$lib/index.js';

	export let data;

	console.info(
		$LL.log({
			fileName: 'routes/[[lang=lang]]/[l_news=l_news]/[post]/+page.svelte'
		})
	);
</script>

<h2>
	{data.post.title}
</h2>
<div class="content">
	{data.post.content}
</div>
