<script lang="ts">
	import LL from '$i18n/i18n-svelte.js';

	console.info(
		$LL.log({
			fileName: 'routes/[[lang=lang]]/[l_about=l_about]/+page.svelte'
		})
	);
</script>

<h2>
	{$LL.pageAbout.title()}
</h2>
<div class="content">
	{$LL.pageAbout.text()}
</div>
