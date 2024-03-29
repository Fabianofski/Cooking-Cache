<script lang="ts">
	import { createNewRecipeCollection } from '$lib/http/recipeCollection.handler';
	import type { User } from 'firebase/auth';
	import Header from '../../components/Header.svelte';
	import RecipeCollectionCard from '../../components/RecipeCollectionCard.svelte';
	import RecipeCollectionSkeleton from '../../components/RecipeCollectionSkeleton.svelte';
	import type { RecipeCollections } from '../../models/RecipeCollections';
	import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
	import { currentUser, loadingStateStore, type LoadingState } from '../../stores/store';

	let recipeCollections: RecipeCollections;
	recipeCollectionsStore.subscribe((value) => {
		recipeCollections = value;
	});

	let loadingState: LoadingState;
	loadingStateStore.subscribe((value) => {
		loadingState = value;
	});

	let createCollectionModal: HTMLDialogElement;
	let collectionName: string = '';
	let loading: boolean = false;
	async function createNewCollection() {
		if (!$currentUser) return;

		loading = true;
		await createNewRecipeCollection($currentUser, collectionName);
		loading = false;
		createCollectionModal.close();
	}
</script>

<svelte:head>
	<title>Rezeptsammlungen | Cooking Cache</title>
</svelte:head>

<Header title={'Rezeptsammlungen'} loading={false} />

<div class="grid grid-cols-fluid gap-4 mt-4">
	{#if loadingState === 'LOADING'}
		<RecipeCollectionSkeleton />
		<RecipeCollectionSkeleton />
	{:else if Object.values(recipeCollections).length === 0}
		<p class="italic text-center col-span-full text-neutral-400 mt-12">
			Du bist noch keiner Rezeptsammlung beigetreten oder hast noch keine erstellt.
		</p>
	{:else}
		{#each Object.values(recipeCollections) as collection}
			<RecipeCollectionCard recipeCollection={collection} />
		{/each}
	{/if}
</div>

<div class="fixed max-w-3xl w-full bottom-0 z-20">
	<button
		class="btn btn-circle btn-primary w-14 h-14 absolute bottom-[5.5rem] right-9"
		class:btn-disabled={$currentUser === null}
		on:click={() => {
			createCollectionModal.showModal();
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="28"
			viewBox="0 -960 960 960"
			width="28"
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
