<script lang="ts">
	import RecipeCard from '$lib/RecipeCard.svelte';
	import type { Recipe } from '../../models/Recipe';
	import { recipesStore } from '../../stores/store';

	let recipes: Recipe[] = [];
	recipesStore.subscribe((value) => {
		recipes = value;
	});
</script>

<div class="flex gap-4 flex-col items-center">
	<div class="grid grid-cols-fluid gap-6 w-full justify-center mt-4">
		{#each recipes as recipe}
			<RecipeCard {recipe} />
		{/each}
	</div>
	<div class="join justify-center">
		<button class="join-item btn">«</button>
		<button class="join-item btn">Page 1</button>
		<button class="join-item btn">»</button>
	</div>
</div>
