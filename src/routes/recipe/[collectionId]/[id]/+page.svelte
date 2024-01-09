<script lang="ts">
	import { goto } from '$app/navigation';
	import { deleteRecipeFromCollection } from '$lib/recipe.handler';
	import type { User } from 'firebase/auth';
	import Header from '../../../../components/Header.svelte';
	import type { Recipe } from '../../../../models/Recipe';
	import { recipeCollectionsStore } from '../../../../stores/recipeCollectionsStore';
	import { currentUser } from '../../../../stores/store';
	import RecipePage from './RecipePage.svelte';

	export let data;

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let recipe: Recipe | undefined;
	let loading = true;
	let editPermissions = false;
	recipeCollectionsStore.subscribe((collections) => {
		if (!collections || !(data.collectionId in collections)) return;
		loading = false;
		recipe = collections[data.collectionId].recipes.find((recipe) => recipe.id === data.id);
		editPermissions =
			collections[data.collectionId].ownerId === user?.uid || recipe?.creatorId === user?.uid;
	});

	let deletionModal: HTMLDialogElement;
	function openDeletionModal() {
		deletionModal.open = true;
	}

	let loadingDeletion = false;
	async function deleteRecipe() {
		if (!recipe || !user) return;
		loadingDeletion = true;
		await deleteRecipeFromCollection(user, recipe);
		loadingDeletion = false;
	}
</script>

{#if recipe || loading}
	<div>
		<Header
			backLink={`/recipes/${data.collectionId}`}
			title={recipe?.title || ''}
			{loading}
			options={editPermissions
				? [
						{
							title: 'Rezept bearbeiten',
							callback: () => goto(`/recipe/${data.collectionId}/${data.id}/edit`),
							icon: '/edit.svg'
						},
						{
							title: 'Rezept Löschen',
							callback: openDeletionModal,
							icon: '/delete.svg'
						}
				  ]
				: []}
		/>
		<RecipePage {recipe} />
	</div>

	<dialog id="my_modal_1" class="modal" bind:this={deletionModal}>
		<div class="modal-box">
			<h3 class="font-bold text-lg text-center">
				Bist du sicher, dass du das Rezept: "{recipe?.title}" löschen möchtest?
			</h3>
			<div class="modal-action">
				<button
					class="btn btn-block btn-outline btn-error"
					on:click={deleteRecipe}
					disabled={loadingDeletion}
				>
					{#if loadingDeletion}
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
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
							/>
						</svg>
						Rezept löschen
					{/if}
				</button>
			</div>

			<form class="absolute top-0 right-0" method="dialog">
				<button
					disabled={loadingDeletion}
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				>
					✕
				</button>
			</form>
		</div>
	</dialog>
{:else}
	Error 404
{/if}
