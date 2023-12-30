<script lang="ts">
	import type { User } from 'firebase/auth';
	import Header from '../../../../components/Header.svelte';
	import type { Recipe } from '../../../../models/Recipe';
	import { currentUser, recipesStore } from '../../../../stores/store';
	import RecipePage from './RecipePage.svelte';
	import { createNewAlert } from '../../../../components/alerts/alert.handler';
	import { goto } from '$app/navigation';

	export let data;

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let recipe: Recipe | undefined;
	let loading = true;
	let editPermissions = false;
	recipesStore.subscribe((collections) => {
		if (!collections || !(data.collectionId in collections)) return;
		loading = false;
		recipe = collections[data.collectionId].recipes.find((recipe) => recipe.id === data.id);
		editPermissions =
			collections[data.collectionId].ownerId === user?.uid || recipe?.creatorId === user?.uid;
	});

	let loadingDeletion = false;
	function deleteRecipe() {
		user?.getIdToken().then((token) => {
			if (!recipe) return;
			loadingDeletion = true;
			fetch(`/api/collection/${recipe.collectionId}/recipe?id=${recipe.id}`, {
				method: 'DELETE',
				headers: {
					Authorization: token
				}
			})
				.then(async () => {
					const link = `/recipes/${recipe?.collectionId}`;
					recipesStore.update((value) => {
						if (recipe)
							value[recipe.collectionId].recipes = value[recipe.collectionId].recipes.filter(
								(x) => x.id !== recipe?.id
							);
						return value;
					});
					loadingDeletion = false;
					createNewAlert({
						message: 'Das Rezept wurde erfolgreich gelöscht!',
						type: 'success'
					});
					goto(link);
				})
				.catch(() => {
					loadingDeletion = false;
					createNewAlert({
						message: 'Beim Löschen vom Rezept ist ein Fehler aufgetreten!',
						type: 'error'
					});
				});
		});
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
							callback: () => console.log('edit'),
							icon: '/edit.svg'
						},
						{
							title: 'Rezept Löschen',
							callback: deleteRecipe,
							icon: '/delete.svg'
						}
				  ]
				: []}
		/>
		<RecipePage {recipe} />
	</div>
{:else}
	Error 404
{/if}
