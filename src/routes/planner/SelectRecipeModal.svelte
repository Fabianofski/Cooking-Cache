<script lang="ts">
	import SmallRecipeCard from '../../components/SmallRecipeCard.svelte';
	import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';

	export let modal: HTMLDialogElement;
	export let selectedHandler: (recipe: Recipe) => void;

	let recipes: Recipe[] = [];
	recipeCollectionsStore.subscribe((value) => {
		if (!value) return;

		for (const collection of Object.values(value)) {
			recipes.push(...collection.recipes);
		}
		recipes = [...recipes];
	});
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box flex flex-col gap-4 max-w-[30rem] px-4">
		<h3 class="text-lg font-bold">Rezept auswählen</h3>
		<div class="flex flex-col gap-2 h-[34rem] overflow-y-auto">
			{#each recipes as recipe}
				<SmallRecipeCard {recipe} clickHandler={selectedHandler} />
			{/each}
		</div>
		<form method="dialog">
			<button class="btn btn-ghost btn-block">Abbrechen</button>
		</form>
	</div>
</dialog>
