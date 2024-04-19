<script lang="ts">
	import type { Recipe } from '../models/Recipe';
	import { currentUser, loadingStateStore, dailyRecipeStore } from '../stores/store';
	import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
	import type { RecipeCollection } from '../models/RecipeCollections';
	import SmallRecipeCard from '../components/SmallRecipeCard.svelte';
	import SmallRecipeSkeleton from '../components/SmallRecipeSkeleton.svelte';

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

	{#if !$dailyRecipeStore}
		<div class="flex flex-col gap-2 items-center">
			<span class="skeleton w-64 h-8" />
			<div class="skeleton w-full h-72" />
			<span class="skeleton w-52 h-8" />
		</div>
	{:else}
		<div class="flex flex-col gap-2">
			<h2 class="text-2xl font-bold text-center mb-2">Tägliches Rezept 🍽️</h2>
			<a href="/daily">
				<img
					class="w-full h-72 object-cover rounded-lg"
					src={$dailyRecipeStore.image}
					alt={$dailyRecipeStore.title}
				/>
			</a>
			<h2 class="text-lg text-center font-bold">{$dailyRecipeStore?.title}</h2>
		</div>
	{/if}

	{#if $loadingStateStore !== 'FINISHED'}
		<div class="flex flex-col items-center">
			<span class="skeleton w-64 h-8 mb-2" />
			<div class="flex flex-col gap-2 w-full">
				{#each new Array(5) as _}
					<SmallRecipeSkeleton />
				{/each}
			</div>
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
