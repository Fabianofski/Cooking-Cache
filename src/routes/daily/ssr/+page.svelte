<script lang="ts">
	import RecipePage from '../../recipe/[collectionId]/[id]/RecipePage.svelte';

	export let data;
</script>

<RecipePage recipe={data.recipe} />
