<script lang="ts">
	import type { Recipe } from '../models/Recipe';
	import { currentUser, loadingStateStore } from '../stores/store';
	import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
	import type { RecipeCollection } from '../models/RecipeCollections';
	import RecipeSkeleton from '../components/RecipeSkeleton.svelte';
	import SmallRecipeCard from '../components/SmallRecipeCard.svelte';

	const recipes: Recipe[] = [];
	recipeCollectionsStore.subscribe((value) => {
		for (let collectionId in value) {
			const collection: RecipeCollection = value[collectionId];
			collection.recipes.forEach((recipe) => {
				recipes.push(recipe);
			});
		}
	});

	function getRandomRecipes() {
		const randomRecipes: Recipe[] = [];
		while (randomRecipes.length < Math.min(recipes.length, 5)) {
			const randomIndex = Math.floor(Math.random() * recipes.length);
			const recipe = recipes[randomIndex];
			if (!randomRecipes.find((x) => x.id === recipe.id)) {
				randomRecipes.push(recipe);
			}
		}
		return randomRecipes;
	}
</script>

<svelte:head>
	<title>Home | Cooking Cache</title>
</svelte:head>

<div class="flex flex-col gap-8">
	{#if $loadingStateStore !== 'FINISHED'}
		<div class="flex flex-col gap-1 items-center">
			<span class="skeleton w-64 h-8" />
			<span class="skeleton w-52 h-8" />
		</div>
	{:else}
		<h1 class="text-2xl font-extrabold text-center mb-2">
			Wilkommen zurück 🍕
			<br />
			{$currentUser?.displayName}
		</h1>
	{/if}

	{#if $loadingStateStore !== 'FINISHED'}
		<div class="flex flex-col gap-1 items-center">
			<span class="skeleton w-64 h-8" />
			<RecipeSkeleton />
		</div>
	{:else}
		<div>
			<h2 class="text-2xl font-bold text-center mb-2">Schon probiert? 🥗</h2>
			<div
				class="flex flex-col items-center justify-center gap-2 h-80 rounded-lg"
				class:bg-base-200={recipes.length === 0}
			>
				{#if recipes.length > 0}
					{#each getRandomRecipes() as recipe}
						<SmallRecipeCard {recipe} />
					{/each}
				{:else}
					<p class="italic text-center col-span-full text-neutral-400">
						Du hast noch keine Rezepte hinzugefügt.
					</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
