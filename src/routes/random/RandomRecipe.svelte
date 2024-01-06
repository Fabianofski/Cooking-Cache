<script lang="ts">
	import RecipeCard from '../../components/RecipeCard.svelte';
	import type { Recipe } from '../../models/Recipe';
	import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';

	let recipes: Recipe[] = [];
	let index = 0;
	recipeCollectionsStore.subscribe((value) => {
		if (Object.values(value).length > 0) recipes = Object.values(value)[0].recipes;
	});

	function setRandomRecipeIndex() {
		let rand = Math.random() * recipes.length;
		index = Math.floor(rand);
	}
	setRandomRecipeIndex();
</script>

<RecipeCard recipe={recipes[index]} collectionId={'Hauptsammlung'} />
<button class="btn btn-primary w-full mt-2" on:click={setRandomRecipeIndex}>
	Neues zufälliges Rezept
</button>
