<script lang="ts">
	import RecipeCollectionCard from '../../components/RecipeCollectionCard.svelte';
	import {
		currentUser,
		recipesStore,
		type LoadingState,
		loadingStateStore
	} from '../../stores/store';
	import type { RecipeCollections } from '../../models/RecipeCollections';
	import type { User } from 'firebase/auth';
	import { createNewAlert } from '../../components/alerts/alert.handler';
	import RecipeCollectionSkeleton from '../../components/RecipeCollectionSkeleton.svelte';

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let recipeCollections: RecipeCollections;
	recipesStore.subscribe((value) => {
		recipeCollections = value;
	});

	let loadingState: LoadingState;
	loadingStateStore.subscribe((value) => {
		loadingState = value;
	});

	let createCollectionModal: HTMLDialogElement;
	let illegalCharacters = ['.', '#', '$', '[', ']'];
	let collectionName: string = '';
	let loading: boolean = false;
	function createNewCollection() {
		for (let char in illegalCharacters) {
			if (collectionName.includes(char)) {
				createNewAlert({
					message:
						'Der Name der Sammlung darf die folgenden Buchstaben nicht enthalten: "' +
						illegalCharacters.join('", "') +
						'"',
					type: 'error'
				});
				return;
			}
		}

		loading = true;

		user?.getIdToken().then((token) => {
			fetch(`/api/collection?collectionName=${collectionName}`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: token
				}
			})
				.then(() => {
					recipesStore.update((value) => {
						value[collectionName] = {
							participants: [],
							// @ts-ignore
							ownerId: user.uid,
							recipes: []
						};
						return value;
					});
					loading = false;
					createCollectionModal.close();
					createNewAlert({
						message: 'Die Rezeptsammlung wurde erfolgreich hinzugefügt!',
						type: 'success'
					});
				})
				.catch(() => {
					loading = false;
					createNewAlert({
						message: 'Beim Hinzufügen der Rezeptsammlung ist ein Fehler aufgetreten!',
						type: 'error'
					});
				});
		});
	}
</script>

<div class="flex gap-4 flex-col items-center">
	<div class="w-full">
		<div class="w-full">
			<h2 class="text-lg font-bold text-center">Rezeptsammlungen</h2>
		</div>
		<div class="divider my-0" />
	</div>
</div>

<div class="grid grid-cols-fluid gap-4">
	{#if loadingState === 'LOADING'}
		<RecipeCollectionSkeleton />
		<RecipeCollectionSkeleton />
	{:else}
		{#each Object.keys(recipeCollections) as collectionName}
			<RecipeCollectionCard {collectionName} recipeCollection={recipeCollections[collectionName]} />
		{/each}
	{/if}
</div>

<div class="fixed max-w-3xl w-full bottom-0">
	<button
		class="btn btn-circle btn-primary absolute bottom-20 right-6"
		class:btn-disabled={user === null}
		on:click={() => {
			createCollectionModal.showModal();
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="24"
			viewBox="0 -960 960 960"
			width="24"
			fill="currentColor"
		>
			<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
		</svg>
	</button>
</div>

<dialog bind:this={createCollectionModal} class="modal">
	<div class="modal-box flex flex-col gap-4">
		<h3 class="font-bold text-lg">Rezeptsammlung erstellen</h3>
		<div class="form-control w-full">
			<input
				type="text"
				placeholder="Name der Rezeptsammlung"
				class="input input-bordered w-full"
				bind:value={collectionName}
			/>
			<div class="label">
				<span class="label-text-alt">
					Name der Rezeptsammlung (Ohne: "{illegalCharacters.join('", "')}")
				</span>
			</div>
		</div>
		<button
			class="btn btn-block"
			disabled={loading || Object.keys(recipeCollections).includes(collectionName)}
			on:click={createNewCollection}
		>
			{#if !loading}
				Erstellen
			{:else}
				<span class="loading loading-spinner loading-md" />
			{/if}
		</button>

		<form class="absolute top-0 right-0" method="dialog">
			<button disabled={loading} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
				✕
			</button>
		</form>
	</div>
</dialog>
