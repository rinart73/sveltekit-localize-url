<script lang="ts">
	import LL from '$i18n/i18n-svelte.js';

	console.info(
		$LL.log({
			fileName: 'routes/[[lang=lang]]/[l_about=l_about]/[l_english=l_english]/+page.svelte'
		})
	);
</script>

<h2>
	{$LL.pageEnglish.title()}
</h2>
<div class="content">
	{$LL.pageEnglish.text()}
</div>
