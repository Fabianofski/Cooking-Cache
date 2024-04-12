<script lang="ts">
	import type { RecipeCollection } from '../models/RecipeCollections';

	export let recipeCollection: RecipeCollection | undefined;
	export let clickHandler: (recipeCollection: RecipeCollection) => void = () => {};
</script>

<button
	on:click={() => {
		if (recipeCollection) clickHandler(recipeCollection);
	}}
	class="card w-full bg-base-200 shadow-md shadow-neutral/50"
>
	<div class="flex items-center gap-2 h-14">
		<img
			class="w-24 h-full object-cover"
			src={recipeCollection?.cover}
			alt={recipeCollection?.name}
		/>
		<h4 class="font-bold">{recipeCollection?.name}</h4>
	</div>
</button>
