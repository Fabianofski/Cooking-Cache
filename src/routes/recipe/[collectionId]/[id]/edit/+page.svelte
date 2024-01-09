<script lang="ts">
	import type { Recipe } from '../../../../../models/Recipe';
	import { recipeCollectionsStore } from '../../../../../stores/recipeCollectionsStore';
	import CreateRecipePage from '../../CreateRecipePage.svelte';

	export let data;
	let recipe: Recipe | undefined;
	let loading = true;
	recipeCollectionsStore.subscribe((collections) => {
		if (!collections || !(data.collectionId in collections)) return;
		loading = false;
		recipe = collections[data.collectionId].recipes.find((recipe) => recipe.id === data.id);
	});
</script>

{#if recipe && !loading}
	<CreateRecipePage collectionId={data.collectionId} mode="EDIT" {recipe} />
{/if}
