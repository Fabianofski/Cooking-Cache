<script lang="ts">
	import { onMount } from 'svelte';
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

	let inputs: HTMLElement[] = [];
	onMount(() => {
		inputs[inputs.length - 1].focus();
	});
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
				<input
					bind:this={inputs[index]}
					class="input input-bordered h-12 w-full"
					placeholder={`Schritt ${index + 1}`}
					bind:value={recipe.description[index]}
					on:input={() => {
						stepInputChanged(index);
					}}
				/>
                <button class="btn btn-square btn-ghost" on:click={() => {
                        recipe.description.splice(index, 1);
                        recipe.description = [...recipe.description];
                    }}
                    disabled={recipe.description.length === 1 || index === recipe.description.length - 1}
                    >	
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
         {/each}
	</div>
</div>
