<script lang="ts">
	import RecipeCard from '../components/RecipeCard.svelte';
	import type { Recipe } from '../models/Recipe';
	import { recipesStore } from '../stores/store';
	import RandomRecipe from './random/RandomRecipe.svelte';

	let recipes: Recipe[] = [];
	recipesStore.subscribe((value) => {
		if (Object.values(value).length > 0) recipes = Object.values(value)[0].recipes;
	});
</script>

<div class="flex flex-col gap-8">
	<div>
		<h1 class="text-2xl font-extrabold text-center mb-2">Schon probiert?🍔</h1>
		{#if recipes.length > 0}
			<div class="w-full relative overflow-x-scroll" style="height: 25.5rem;">
				<div class="rounded-box flex gap-2 absolute top-0 left-0 pl-2 pr-2">
					{#each recipes as recipe}
						<div class="w-96">
							<RecipeCard {recipe} collectionId={'Hauptsammlung'} />
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<RecipeCard recipe={null} collectionId={'Hauptsammlung'} />
		{/if}
	</div>

	<div class="w-full">
		<h1 class="text-2xl font-extrabold text-center mb-2">Lass den Zufall entscheiden🤞</h1>
		<RandomRecipe />
	</div>
</div>
