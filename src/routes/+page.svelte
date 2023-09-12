<script lang="ts">
	import RecipeCard from '$lib/RecipeCard.svelte';
	import type { Recipe } from '../models/Recipe';
	import { recipesStore } from '../stores/store';
	import RandomRecipe from './random/RandomRecipe.svelte';

	let recipes: Recipe[];
	recipesStore.subscribe((value) => {
		recipes = value;
	});
</script>

<div class="flex flex-col gap-8">
	<div>
		<h1 class="text-2xl font-extrabold text-center mb-2">Schon probiert?🍔</h1>
		<div class="rounded-box w-full relative overflow-x-scroll h-96">
			<div class="rounded-box flex gap-2 absolute top-0 left-0">
				{#each recipes as recipe}
					<div class="w-96">
						<RecipeCard {recipe} />
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="w-full">
		<h1 class="text-2xl font-extrabold text-center mb-2">Lass den Zufall entscheiden🤞</h1>
		<RandomRecipe />
	</div>
</div>
