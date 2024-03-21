<script lang="ts">
	import { getCollectionFromShortId, getRecipeFromShortId } from '$lib/id.handler';
	import type { Recipe } from '../../../../../models/Recipe';
	import type { RecipeCollection } from '../../../../../models/RecipeCollections';
	import { recipeCollectionsStore } from '../../../../../stores/recipeCollectionsStore';
	import CreateRecipePage from '../../CreateRecipePage.svelte';

	export let data;
	let recipe: Recipe | undefined;
	let loading = true;
	recipeCollectionsStore.subscribe((collections) => {
		const collection: RecipeCollection = getCollectionFromShortId(data.collectionId, collections);
		if (!collection) return;
		loading = false;
		recipe = getRecipeFromShortId(data.id, collection.recipes);
	});
</script>

<svelte:head>
	<title>Bearbeiten: {recipe?.title} | Cooking Cache</title>
</svelte:head>

{#if recipe && !loading}
	<CreateRecipePage shortId={data.collectionId} mode="EDIT" {recipe} />
{/if}
