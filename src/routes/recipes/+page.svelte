<script lang="ts">
	import RecipeCard from '$lib/RecipeCard.svelte';
	import type { Recipe } from '../../models/Recipe';
	import { recipesStore } from '../../stores/store';

	let recipes: Recipe[] = [];
	recipesStore.subscribe((value) => {
		recipes = value;
	});
</script>

<button class="btn btn-primary w-full"> + </button>

<div class="grid grid-cols-fluid gap-6 w-full justify-center mt-4">
	{#each recipes as recipe}
		<RecipeCard {recipe} />
	{/each}
</div>
