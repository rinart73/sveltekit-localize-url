<script lang="ts">
	import LL from '$i18n/i18n-svelte.js';

	console.info(
		$LL.log({
			fileName: 'routes/[[lang=lang]]/[l_about=l_about]/[l_partial=l_partial]/+page.svelte'
		})
	);
</script>

<h2>
	{$LL.pagePartial.title()}
</h2>
<div class="content">
	{$LL.pagePartial.text()}
</div>
