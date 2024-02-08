<script lang="ts">
	import { defaultCollectionCovers } from '$lib/defaultCollectionCovers';
	import { editRecipeCollectionCoverUrl } from '$lib/http/recipeCollection.handler';
	import { currentUser } from '../../../../stores/store';

	export let modal: HTMLDialogElement;
	export let loadingCoverReplacement: boolean;
	export let collectionId: string;

	async function replaceCover(cover: string) {
		if (!$currentUser) return;
		loadingCoverReplacement = true;
		await editRecipeCollectionCoverUrl($currentUser, collectionId, cover);
		loadingCoverReplacement = false;
		modal.close();
	}
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box flex flex-col gap-4 max-w-[40rem]">
		<h3 class="font-bold text-lg">Cover der Rezeptsammlung ändern</h3>

		<div class="grid grid-cols-fluid-narrow gap-2 max-h-[34rem] overflow-y-auto">
			{#each Object.keys(defaultCollectionCovers) as coverCategory}
				<h4 class="font-bold text-sm col-span-full">{coverCategory}</h4>
				{#each defaultCollectionCovers[coverCategory] as cover}
					<div class="flex flex-col items-center">
						<img src={cover} alt="" class="w-full h-32 object-cover rounded-lg" />
						<button
							class="btn btn-sm btn-block btn-primary mt-2"
							disabled={loadingCoverReplacement}
							on:click={() => replaceCover(cover)}
						>
							Auswählen
						</button>
					</div>
				{/each}
				<div class="divider col-span-full" />
			{/each}
		</div>

		<form method="dialog">
			<button disabled={loadingCoverReplacement} class="btn btn-ghost btn-block">Abbrechen</button>
		</form>
	</div>
</dialog>
