<script lang="ts">
	import type { Participant } from '../../../../models/RecipeCollections';
	import { removeFromRecipeCollection } from '$lib/http/recipeCollection.handler';
	import { currentUser } from '../../../../stores/store';

	export let participant: Participant | undefined;
	export let modal: HTMLDialogElement;
	export let collectionId: string;

	let loadingRemoval = false;

	async function removeParticipant() {
		if (!$currentUser || !participant) return;

		loadingRemoval = true;
		await removeFromRecipeCollection($currentUser, collectionId, participant.uid);
		loadingRemoval = false;
		modal.close();
	}
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box flex flex-col gap-4 max-w-[30rem] px-12">
		<div class="flex gap-4 px-12 justify-between items-center">
			<img
				class="rounded-full w-20 h-20"
				src={participant?.photoURL}
				alt={participant?.displayName}
			/>
			<h3 class="text-lg font-bold">
				{participant?.displayName}
			</h3>
		</div>
		<button
			class="btn btn-outline btn-error btn-block"
			disabled={loadingRemoval}
			on:click={removeParticipant}
		>
			{#if !loadingRemoval}
				<span>Teilnehmer entfernen</span>
			{:else}
				<span class="loading loading-spinner loading-md" />
			{/if}
		</button>
		<form method="dialog">
			<button disabled={loadingRemoval} class="btn btn-ghost btn-block">Abbrechen</button>
		</form>
	</div>
</dialog>
