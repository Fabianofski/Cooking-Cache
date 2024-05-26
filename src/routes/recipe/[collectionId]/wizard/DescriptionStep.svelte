<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';

	export let recipe: Recipe;
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
					class="input input-bordered h-16 w-full min-h-12 max-h-48"
					placeholder={`Schritt ${index + 1}`}
					bind:value={recipe.description[index]}
				/>
				<button
					class="btn btn-ghost btn-sm"
					on:click={() => {
						recipe.description.splice(index, 1);
						recipe.description = [...recipe.description];
					}}
					class:invisible={recipe.description.length === 1}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 32 32"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		{/each}
		<button
			class="btn btn-neutral btn-sm w-52 ml-8"
			on:click={() => {
				recipe.description = [...recipe.description, ''];
			}}
		>
			+
		</button>
	</div>
</div>
