<script lang="ts">
	import type { RecipeCollection } from '../models/RecipeCollections';
	import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';

	export let modal: HTMLDialogElement;
	export let selectedHandler: (recipe: RecipeCollection) => void;
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box flex flex-col gap-4 max-w-[30rem] px-4">
		<h3 class="text-lg font-bold">Wähle eine Rezeptsammlung</h3>
		<div class="flex flex-col gap-2 h-[34rem] overflow-y-auto">
			{#each Object.values($recipeCollectionsStore) as collection}
				<button
					on:click={() => {
						selectedHandler(collection);
					}}
				>
					{collection.id}
				</button>
			{/each}
		</div>
		<form method="dialog">
			<button class="btn btn-ghost btn-block">Abbrechen</button>
		</form>
	</div>
</dialog>
