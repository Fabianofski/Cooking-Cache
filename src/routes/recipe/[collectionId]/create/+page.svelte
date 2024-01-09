<script lang="ts">
	import CreateRecipePage from '../CreateRecipePage.svelte';

	export let data;
</script>

<CreateRecipePage collectionId={data.collectionId} mode="CREATE" />
