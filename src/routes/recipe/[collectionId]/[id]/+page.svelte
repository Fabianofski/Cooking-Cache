<script lang="ts">
	import Header from '../../../../components/Header.svelte';
	import type { Recipe } from '../../../../models/Recipe';
	import { recipesStore } from '../../../../stores/store';
	import RecipePage from './RecipePage.svelte';

	export let data;

	let recipe: Recipe | undefined;
	let loading = true;
	recipesStore.subscribe((collections) => {
		if (!collections || !(data.collectionId in collections)) return;
		loading = false;
		recipe = collections[data.collectionId].recipes.find((recipe) => recipe.id === data.id);
	});
</script>

{#if recipe || loading}
	<div>
		<Header
			backLink={`/recipes/${data.collectionId}`}
			title={recipe?.title || ''}
			{loading}
			options={[
				{
					title: 'Rezept bearbeiten',
					callback: () => console.log('edit'),
					icon: '/edit.svg'
				},
				{
					title: 'Rezept Löschen',
					callback: () => console.log('delete'),
					icon: '/delete.svg'
				}
			]}
		/>
		<RecipePage {recipe} />
	</div>
{:else}
	Error 404
{/if}
