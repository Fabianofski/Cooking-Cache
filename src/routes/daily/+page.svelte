<script lang="ts">
	import RecipePage from '../recipe/[collectionId]/[id]/RecipePage.svelte';
	import { currentUser, dailyRecipeStore } from '../../stores/store';
	import Header from '../../components/Header.svelte';
	import SelectCollectionModal from '../SelectCollectionModal.svelte';
	import type { RecipeCollection } from '../../models/RecipeCollections';
	import { addRecipeToCollection } from '$lib/http/recipe.handler';
	import { Capacitor } from '@capacitor/core';
	import { createNewAlert } from '../../components/alerts/alert.handler';
	import { Share } from '@capacitor/share';

	let modal: HTMLDialogElement;
	function saveAsRecipe() {
		modal.showModal();
	}

	async function selectedCollection(collection: RecipeCollection) {
		modal.close();
		if (!$currentUser || !$dailyRecipeStore) return;

		const formData = new FormData();
		const recipe = $dailyRecipeStore;
		recipe.collectionId = collection.id;
		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection($currentUser, formData, collection.id);
	}

	async function shareDailyRecipe() {
		const url = 'https://cooking-cache.web.app/daily';

		if (!$dailyRecipeStore) return;

		if (Capacitor.isNativePlatform()) {
			await Share.share({
				title: $dailyRecipeStore.title,
				text: 'Schau dir das Rezept an!\n',
				url: url
			});
		} else {
			navigator.clipboard.writeText(url);
			createNewAlert({
				type: 'success',
				message: 'Der Link zum Rezept wurde in die Zwischenablage kopiert'
			});
		}

		try {
			(document.activeElement as HTMLElement).blur();
		} catch (e) {}
	}
</script>

<Header
	title="Tägliches Rezept 🍽️"
	backLink="/"
	options={$currentUser
		? [
				{
					title: 'Rezept teilen',
					callback: shareDailyRecipe,
					icon: '/share.svg'
				},
				{
					title: 'Rezept speichern',
					callback: saveAsRecipe,
					icon: '/bookmark.svg'
				}
		  ]
		: [
				{
					title: 'Rezept teilen',
					callback: shareDailyRecipe,
					icon: '/share.svg'
				}
		  ]}
/>
<RecipePage recipe={$dailyRecipeStore ?? undefined} />
<SelectCollectionModal bind:modal selectedHandler={selectedCollection} />
