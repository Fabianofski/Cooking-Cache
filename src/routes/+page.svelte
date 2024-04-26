<script lang="ts">
	import type { Recipe } from '../models/Recipe';
	import {
		currentUser,
		loadingStateStore,
		dailyRecipeStore,
		weeklyPlanStore
	} from '../stores/store';
	import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
	import type { RecipeCollection } from '../models/RecipeCollections';
	import SmallRecipeCard from '../components/SmallRecipeCard.svelte';
	import SmallRecipeSkeleton from '../components/SmallRecipeSkeleton.svelte';
	import { generateShortCollectionId, generateShortRecipeId } from '$lib/id.handler';

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

	function getWeeklyPlanRecipesLength() {
		let count = 0;
		for (let day in $weeklyPlanStore) {
			count += $weeklyPlanStore[day].recipes.length;
		}
		return count;
	}

	function getNumberOfUniqueParticpants() {
		const participants = new Set();
		for (let collection in $recipeCollectionsStore) {
			const collectionParticipants = $recipeCollectionsStore[collection].participants;
			if (!collectionParticipants) continue;

			collectionParticipants.forEach((participant) => {
				participants.add(participant.uid);
			});
		}
		return participants.size - 1;
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
		<div class="flex gap-1 my-0.5 flex-wrap justify-center">
			{#each new Array(3) as _}
				<div class="skeleton h-28 stat" />
			{/each}
		</div>
	{:else}
		<div class="stats shadow-lg bg-base-200 flex flex-wrap justify-center">
			<div class="stat place-items-center">
				<div class="stat-figure">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-8 h-8"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
						/>
					</svg>
				</div>
				<div class="stat-title">Teilnehmer</div>
				<div class="stat-value">{getNumberOfUniqueParticpants()}</div>
				<div class="stat-desc">In {Object.values($recipeCollectionsStore).length} Sammlungen</div>
			</div>

			<div class="stat place-items-center">
				<div class="stat-figure">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-8 h-8"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
						/>
					</svg>
				</div>
				<div class="stat-title">Rezepte</div>
				<div class="stat-value">{recipes.length}</div>
				<div class="stat-desc">
					Seit {new Date($currentUser?.metadata.creationTime || '').toLocaleDateString()}
				</div>
			</div>

			<div class="stat place-items-center">
				<div class="stat-figure">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-8 h-8"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
						/>
					</svg>
				</div>
				<div class="stat-title">Rezepte geplant</div>
				<div class="stat-value">{getWeeklyPlanRecipesLength()}</div>
				<div class="stat-desc">An {Object.keys($weeklyPlanStore ?? {}).length} Wochentagen</div>
			</div>
		</div>
	{/if}

	{#if !$dailyRecipeStore}
		<div class="flex flex-col gap-2 items-center">
			<span class="skeleton w-64 h-8" />
			<div class="skeleton w-full h-72" />
			<span class="skeleton w-52 h-8" />
		</div>
	{:else}
		<div class="flex flex-col gap-2">
			<h2 class="text-2xl font-bold text-center mb-2">Heutige Kochinspiration 🍽️</h2>
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
			<h2 class="text-2xl font-bold text-center mb-2">Rezept-Roulette! 🎰</h2>
			<div
				class="flex flex-col items-center justify-center gap-2 h-80 rounded-lg"
				class:bg-base-200={recipes.length === 0}
			>
				{#if recipes.length > 0}
					{#each getRandomRecipes() as recipe}
						<a
							class="w-full"
							href={`/recipe/${generateShortCollectionId(
								$recipeCollectionsStore[recipe.collectionId],
								$recipeCollectionsStore
							)}/${generateShortRecipeId(
								recipe,
								$recipeCollectionsStore[recipe.collectionId].recipes
							)}`}
						>
							<SmallRecipeCard {recipe} />
						</a>
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

<style>
	.stat {
		width: 15rem;
	}

	@media (max-width: 500px) {
		.stat {
			width: 100%;
			border-width: 0px !important;
		}
	}

	@media (max-width: 736px) and (min-width: 500px) {
		.stat {
			border-left-width: 1px !important;
			border-right-width: 1px !important;
		}
	}
</style>
