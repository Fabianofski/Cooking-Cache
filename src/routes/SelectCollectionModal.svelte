<script lang="ts">
	import SmallRecipeCollectionCard from '../components/SmallRecipeCollectionCard.svelte';
	import SmallRecipeSkeleton from '../components/SmallRecipeSkeleton.svelte';
	import type { RecipeCollection } from '../models/RecipeCollections';
	import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
	import { loadingStateStore } from '../stores/store';

	export let modal: HTMLDialogElement;
	export let selectedHandler: (recipe: RecipeCollection) => void;
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box flex flex-col gap-4 max-w-[30rem] px-4">
		<h3 class="text-lg font-bold">Wähle eine Rezeptsammlung</h3>
		<div class="flex flex-col gap-2 h-[34rem] overflow-y-auto">
			{#if $loadingStateStore !== 'FINISHED'}
                {#each Array.from({ length: 5 }) as _}
                    <SmallRecipeSkeleton />
                {/each}
			{:else}
				{#each Object.values($recipeCollectionsStore) as collection}
					<SmallRecipeCollectionCard recipeCollection={collection} clickHandler={selectedHandler} />
				{/each}
			{/if}
		</div>
		<form method="dialog">
			<button class="btn btn-ghost btn-block">Abbrechen</button>
		</form>
	</div>
</dialog>
