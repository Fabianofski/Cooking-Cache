<script lang="ts">
	import {
		deleteRecipeCollection,
		editRecipeCollectionCoverImage,
		editRecipeCollectionName,
		leaveRecipeCollection,
		toggleRecipeCollectionVisibility
	} from '$lib/recipeCollection.handler.js';
	import type { User } from 'firebase/auth';
	import Header from '../../../../components/Header.svelte';
	import { createNewAlert } from '../../../../components/alerts/alert.handler.js';
	import type { RecipeCollection } from '../../../../models/RecipeCollections.js';
	import { recipeCollectionsStore } from '../../../../stores/recipeCollectionsStore.js';
	import { currentUser, loadingStateStore, type LoadingState } from '../../../../stores/store.js';

	export let data;
	const collectionId = data.collectionId;
	let collectionName: string;

	let loadingState: LoadingState;
	loadingStateStore.subscribe((value) => {
		loadingState = value;
	});

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let recipeCollection: RecipeCollection;
	let isOwner: boolean;
	let inviteLink: string = '';
	recipeCollectionsStore.subscribe((value) => {
		if (collectionId in value) {
			recipeCollection = value[collectionId];
			collectionName = recipeCollection.name;
			isOwner = recipeCollection.ownerId === user?.uid;
			const hostname = window.location.hostname;
			const port = hostname == 'localhost' ? ':' + window.location.port : '';
			inviteLink = `${hostname}${port}/collection/join?i=${recipeCollection.inviteCode}`;
		}
	});

	function copyInviteLink() {
		navigator.clipboard.writeText(inviteLink);
		createNewAlert({
			message: 'Der Einladungslink wurde erfolgreich in die Zwischenablage kopiert!',
			type: 'success'
		});
	}

	let editingName: boolean;
	let loadingRename: boolean;
	let newName: string;
	async function editName() {
		if (!editingName) {
			newName = collectionName;
			editingName = true;
			return;
		}

		if (collectionName === newName) {
			editingName = false;
			return;
		}

		if (!user) return;

		loadingRename = true;
		collectionName = newName;

		await editRecipeCollectionName(user, collectionId, newName);

		loadingRename = false;
		editingName = false;
	}

	let dialog: HTMLDialogElement;
	let confirmation: string = '';
	let loadingDeletion: boolean = false;
	async function deleteList() {
		if (!user) return;

		loadingDeletion = true;
		await deleteRecipeCollection(user, collectionId);
		loadingDeletion = false;
	}

	async function leaveList() {
		if (!user) return;

		loadingDeletion = true;
		await leaveRecipeCollection(user, collectionId);
		loadingDeletion = false;
	}

	let coverFileInput: HTMLInputElement;
	function openFileSelection() {
		coverFileInput.click();
	}

	let loadingCoverReplacement: boolean = false;
	async function replaceCoverImage(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file || !user) return;

		loadingCoverReplacement = true;
		await editRecipeCollectionCoverImage(user, collectionId, file);
		loadingCoverReplacement = false;
	}

	let loadingVisibilityChange: boolean = false;
	async function changeCollectionVisibility() {
		if (!user) return;

		loadingVisibilityChange = true;
		await toggleRecipeCollectionVisibility(user, collectionId, !recipeCollection.private);
		loadingVisibilityChange = false;
	}
</script>

<div class="flex flex-col gap-6">
	<Header
		title={`Einstellungen: ${collectionName}`}
		loading={loadingState !== 'FINISHED'}
		backLink="/recipes"
	/>

	<div class="flex flex-col gap-2">
		<div class="relative">
			{#if loadingCoverReplacement || loadingState !== 'FINISHED'}
				<div class="skeleton w-full h-36 rounded" />
			{:else}
				<img
					class="w-full h-36 rounded object-cover"
					src={recipeCollection?.cover || '/default-cover.jpg'}
					alt={`${collectionName} Cover`}
				/>
			{/if}
			{#if isOwner}
				<div class="absolute bottom-0 translate-y-1/2 right-0 -translate-x-1/2">
					<input
						bind:this={coverFileInput}
						class="hidden"
						type="file"
						accept="image/*"
						on:change={replaceCoverImage}
					/>
					<button
						class="btn btn-primary btn-circle"
						disabled={loadingCoverReplacement}
						on:click={openFileSelection}
					>
						{#if loadingCoverReplacement}
							<span class="loading loading-spinner loading-md" />
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
									d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
								/>
							</svg>
						{/if}
					</button>
				</div>
			{/if}
		</div>
		{#if loadingState !== 'FINISHED'}
			<div class="skeleton w-3/4 h-10 rounded" />
		{:else}
			<table class="text-lg">
				<tbody>
					<td class="w-24">Name:</td>
					<td class="font-bold w-40">
						{#if editingName && isOwner}
							<input
								type="text"
								class="input input-bordered"
								bind:value={newName}
								on:keydown={(e) => {
									if (e.key === 'Enter') {
										editName();
									}
								}}
							/>
						{:else}
							{collectionName}
						{/if}
					</td>
					<td>
						{#if isOwner}
							<button class="btn btn-ghost" on:click={editName}>
								{#if loadingRename}
									<span class="loading loading-spinner loading-md" />
								{:else if editingName}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-5 h-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M4.5 12.75l6 6 9-13.5"
										/>
									</svg>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-5 h-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
										/>
									</svg>
								{/if}
							</button>
						{/if}
					</td>
				</tbody>
			</table>
		{/if}
	</div>

	<hr class="rounded border-neutral" />

	<div class="grid grid-cols-fluid gap-4">
		<div class="flex flex-col gap-2">
			<h3 class="font-bold text-md text-center">Teilnehmer</h3>

			{#if loadingState !== 'FINISHED'}
				{#each [1, 2] as _}
					<div class="flex gap-2 items-center">
						<div class="skeleton w-20 h-12 rounded-full" />
						<div class="flex flex-col gap-1 justify-between w-full">
							<div class="skeleton w-48 h-6 rounded" />
							<div class="skeleton w-56 h-4 rounded" />
						</div>
						<div class="skeleton w-32 h-4 rounded mr-4" />
					</div>
				{/each}
			{:else}
				<table>
					<tbody>
						{#each recipeCollection?.participants || [] as participant}
							<tr>
								<td>
									<img
										class="w-10 h-10 rounded-full"
										src={participant.photoURL || '/default-profile.jpg'}
										alt={participant.displayName || 'User Profile Picture'}
									/>
								</td>
								<td>
									<p class="font-bold">{participant.displayName || '-'}</p>
									<p class="text-sm">{participant.email || '-'}</p>
								</td>
								<td class="text-sm italic">
									{participant.uid === recipeCollection.ownerId ? 'Ersteller' : 'Teilnehmer'}
									{participant.uid === user?.uid ? '(Du)' : ''}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}

			{#if loadingState !== 'FINISHED'}
				<div class="w-full flex gap-1">
					<div class="skeleton w-16 h-8 rounded-3xl" />
					<div class="skeleton w-52 h-8 rounded" />
				</div>
			{:else}
				<div class="form-control">
					<label for="" class="label cursor-pointer justify-start gap-4">
						{#if loadingVisibilityChange}
							<span class="loading loading-spinner loading-md" />
						{/if}
						<input
							type="checkbox"
							class="toggle"
							bind:checked={recipeCollection.private}
							on:input={changeCollectionVisibility}
							disabled={loadingVisibilityChange || !isOwner}
							class:hidden={loadingVisibilityChange}
						/>
						<span class="label-text">Neue Beitrittsanfragen blockieren</span>
					</label>
				</div>
			{/if}

			<div>
				<label for="link" class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Teilnehmer einladen</span>
					</div>
				</label>
				{#if loadingState !== 'FINISHED'}
					<div class="w-full flex gap-1">
						<div class="skeleton w-full h-12 rounded" />
						<div class="skeleton w-24 h-12 rounded" />
					</div>
				{:else}
					<div class="w-full flex">
						<input
							name="link"
							type="text"
							placeholder=""
							class="input input-bordered w-full rounded-r-none"
							value={inviteLink}
							disabled={recipeCollection.private}
						/>
						<button
							class="btn w-24 rounded-l-none"
							on:click={copyInviteLink}
							disabled={recipeCollection.private}
						>
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
									d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
								/>
							</svg>
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<hr class="rounded border-neutral" />

	<div class="flex flex-col gap-2">
		<h3 class="font-bold text-md text-center">Rezeptsammlung verwalten</h3>

		<button
			class="btn btn-outline btn-error"
			disabled={loadingDeletion || loadingState !== 'FINISHED'}
			on:click={() => {
				dialog.showModal();
			}}
		>
			{#if !loadingDeletion && loadingState === 'FINISHED'}
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
	</div>
</div>
