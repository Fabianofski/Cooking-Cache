<script lang="ts">
	import { getCollectionFromShortId } from '$lib/id.handler';
	import type { Recipe } from '../../../../../models/Recipe';
	import { recipeCollectionsStore } from '../../../../../stores/recipeCollectionsStore';
	import CreateRecipePage from '../../CreateRecipePage.svelte';

	export let data;
	let recipe: Recipe | undefined;
	let loading = true;
	recipeCollectionsStore.subscribe((collections) => {
		const collection = getCollectionFromShortId(data.collectionId, collections);
		if (!collection) return;
		loading = false;
		recipe = collection.recipes.find((recipe) => recipe.id === data.id);
	});
</script>

<svelte:head>
	<title>Bearbeiten: {recipe?.title} | Cooking Cache</title>
</svelte:head>

{#if recipe && !loading}
	<CreateRecipePage shortId={data.collectionId} mode="EDIT" {recipe} />
{/if}
