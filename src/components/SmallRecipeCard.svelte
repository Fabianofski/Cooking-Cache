<script lang="ts">
	import type { Recipe } from '../models/Recipe';

	export let recipe: Recipe;
	export let clickHandler: (recipe: Recipe) => void;
</script>

<button
	on:click={() => clickHandler(recipe)}
	class="card w-full bg-base-200 shadow-md shadow-neutral/50"
>
	<div class="flex items-center gap-2 h-14">
		<img class="w-24 h-full object-cover" src={recipe.image} alt={recipe.title} />
		<h4 class="font-bold">{recipe.title}</h4>
	</div>
</button>
