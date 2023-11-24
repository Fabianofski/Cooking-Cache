<script lang="ts">
	import RecipeCollectionCard from '../../components/RecipeCollectionCard.svelte';
	import { recipesStore } from '../../stores/store';
	import type { RecipeCollections } from '../../models/RecipeCollections';

	let recipeCollections: RecipeCollections;
	recipesStore.subscribe((value) => {
		recipeCollections = value;
	});
</script>

<div class="flex gap-4 flex-col items-center">
	<div class="w-full">
		<div class="w-full">
			<h2 class="text-lg font-bold text-center">Rezeptsammlungen</h2>
		</div>
		<div class="divider my-0" />
	</div>
</div>

<div class="grid grid-cols-fluid gap-4">
	{#each Object.keys(recipeCollections) as collectionName}
		<RecipeCollectionCard {collectionName} recipes={recipeCollections[collectionName]} />
	{/each}
</div>
