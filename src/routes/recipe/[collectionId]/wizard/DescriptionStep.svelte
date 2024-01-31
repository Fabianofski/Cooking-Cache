<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';

	export let recipe: Recipe;

	stepInputChanged(recipe.description.length - 1);

	function stepInputChanged(index: number) {
		if (index + 1 === recipe.description.length && recipe.description[index] !== '')
			recipe.description.push('');

		let count = -1;
		for (let j = recipe.description.length - 1; j >= 0; j--) {
			const step = recipe.description[j];
			if (step !== '') break;
			count++;
		}
		recipe.description = recipe.description.slice(0, recipe.description.length - count);
	}
</script>

<div class="form-control col-span-full">
	<label class="label" for="">
		<span class="label-text">Rezept Beschreibung*</span>
	</label>
	<div class="flex flex-col gap-2">
		{#each recipe.description as { }, index}
			<div class="flex">
				<p class="p-2 font-bold w-8 text-center">
					{index + 1}.
				</p>
				<textarea
					class="textarea textarea-bordered h-12 w-full"
					placeholder={'Schritt 1'}
					bind:value={recipe.description[index]}
					on:input={() => {
						stepInputChanged(index);
					}}
				/>
			</div>
		{/each}
	</div>
</div>
