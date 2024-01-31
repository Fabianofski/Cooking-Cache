<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';

	export let recipe: Recipe;
</script>

<div class="form-control w-full col-span-full">
	<label class="label" for="">
		<span class="label-text">Rezept URL</span>
	</label>
	<input
		type="text"
		placeholder="https://www.chefkoch.de/.."
		class="input input-bordered w-full"
		bind:value={recipe.url}
	/>
</div>
<div class="form-control col-span-full">
	<label class="label cursor-pointer justify-start gap-4">
		<input type="checkbox" class="checkbox" />
		<span class="label-text">Rezept automatisch importieren</span>
	</label>
</div>
