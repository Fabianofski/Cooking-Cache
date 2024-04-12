<script lang="ts">
	import CreateRecipePage from '../CreateRecipePage.svelte';

	export let data;
	const shortId = data.collectionId;
</script>

<CreateRecipePage {shortId} mode="CREATE" url={data.url} />
