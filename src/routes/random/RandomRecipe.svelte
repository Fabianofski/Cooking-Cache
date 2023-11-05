<script lang="ts">
	import RecipeCard from '../../components/RecipeCard.svelte';
	import type { Recipe } from '../../models/Recipe';
	import { recipesStore } from '../../stores/store';

	let recipes: Recipe[] = [];
	let index = 0;
	recipesStore.subscribe((value) => {
		recipes = value;
	});

	function setRandomRecipeIndex() {
		let rand = Math.random() * recipes.length;
		index = Math.floor(rand);
	}
	setRandomRecipeIndex();
</script>

<RecipeCard recipe={recipes[index]} />
<button class="btn btn-primary w-full mt-2" on:click={setRandomRecipeIndex}
	>Neues zufälliges Rezept</button
>
