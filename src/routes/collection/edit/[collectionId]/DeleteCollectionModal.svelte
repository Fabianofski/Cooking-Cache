<script lang="ts">
	import {
		deleteRecipeCollection,
		leaveRecipeCollection
	} from '$lib/http/recipeCollection.handler';
	import { currentUser } from '../../../../stores/store';

	export let dialog: HTMLDialogElement;
	export let isOwner: boolean;
	export let loadingDeletion: boolean = false;
	export let collectionId: string;

	let confirmation: string = '';

	async function deleteList() {
		if (!$currentUser) return;

		loadingDeletion = true;
		await deleteRecipeCollection($currentUser, collectionId);
		loadingDeletion = false;
	}

	async function leaveList() {
		if (!$currentUser) return;

		loadingDeletion = true;
		await leaveRecipeCollection($currentUser, collectionId);
		loadingDeletion = false;
	}
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg text-center">
			Willst du diese Rezeptsammlung wirklich {isOwner ? 'löschen' : 'verlassen'}?
		</h3>
		<p class="py-4 text-center">Tippe zum Bestätigen {isOwner ? 'LÖSCHEN' : 'VERLASSEN'} ein</p>
		<div class="form-control w-full max-w-s">
			<input
				type="text"
				placeholder={isOwner ? 'LÖSCHEN' : 'VERLASSEN'}
				bind:value={confirmation}
				class="input input-bordered input-error w-full max-w-s"
				required
			/>
		</div>
		<div class="modal-action">
			<form method="dialog" class="w-full flex flex-col gap-4">
				<button
					class="btn btn-block"
					on:click={() => {
						confirmation = '';
					}}
				>
					Abbrechen
				</button>
				<button
					class="btn btn-error btn-block"
					disabled={loadingDeletion ||
						confirmation.toLowerCase() !== (isOwner ? 'löschen' : 'verlassen')}
					on:click={isOwner ? deleteList : leaveList}
				>
					{#if !loadingDeletion}
						{#if isOwner}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
								/>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
								/>
							</svg>
						{/if}
						Rezeptsammlung {isOwner ? 'löschen' : 'verlassen'}
					{:else}
						<span class="loading loading-spinner loading-md" />
					{/if}
				</button>
			</form>
		</div>
	</div>
</dialog>
