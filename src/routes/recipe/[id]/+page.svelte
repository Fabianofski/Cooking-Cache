<script lang="ts">
	import type { Recipe } from '../../../models/Recipe';
	import { recipesStore } from '../../../stores/store';
	import RecipePage from './RecipePage.svelte';

	export let data;

	let recipes: Recipe[] = [];
	recipesStore.subscribe((value) => {
		recipes = value;
	});
	const recipe = recipes.find((recipe) => recipe.id === data.id);
</script>

{#if recipe}
	<RecipePage {recipe} />
{:else}
	Error 404
{/if}
