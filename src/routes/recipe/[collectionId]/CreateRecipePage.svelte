<script lang="ts">
	import { addRecipeToCollection } from '$lib/http/recipe.handler';
	import type { Recipe } from '../../../models/Recipe';
	import { currentUser } from '../../../stores/store';
	import RecipePage from './[id]/RecipePage.svelte';
	import GeneralStep from './wizard/GeneralStep.svelte';
	import TagStep from './wizard/TagStep.svelte';
	import IngredientStep from './wizard/IngredientStep.svelte';
	import DescriptionStep from './wizard/DescriptionStep.svelte';
	import Header from '../../../components/Header.svelte';
	import ImportStep from './wizard/ImportStep.svelte';
	import { Capacitor } from '@capacitor/core';
	import axios from 'axios';
	import { generateShortRecipeId, getCollectionFromShortId } from '$lib/id.handler';
	import { recipeCollectionsStore } from '../../../stores/recipeCollectionsStore';

	let files: FileList | null = null;
	let steps: string[] = ['Import', 'Allgemein', 'Tags', 'Zutaten', 'Zubereitung', 'Vorschau'];
	let selectedStep = 0;

	export let mode: 'CREATE' | 'EDIT' = 'CREATE';
	export let shortId: string;
	let collectionId: string = '';

	export let recipe: Recipe = {
		image: '',
		title: '',
		tags: [],
		ingredients: { Default: [{ amount: undefined, name: '', unit: '' }] },
		url: '',
		createdTime: new Date().toISOString(),
		updatedTime: new Date().toISOString(),
		cookingTime: 20,
		difficulty: 'medium',
		numberOfServings: 4,
		description: [],
		id: '',
		collectionId: '',
		creatorId: ''
	};

    recipeCollectionsStore.subscribe((value) => {
        collectionId = getCollectionFromShortId(shortId, value)?.id || '';
        recipe.collectionId = collectionId;
    });

	function formIsInvalid(recipe: Recipe) {
		return recipe.title === '' || recipe.description[0] === '';
	}

	let importRecipe: boolean = false;
	let loadingImport: boolean = false;
	let importedRecipes: { [key: string]: Recipe } = {};
	async function importRecipeFromUrl() {
		if (recipe.url === '' || !importRecipe || mode !== 'CREATE') {
			selectedStep++;
			return;
		}

		if (importedRecipes[recipe.url]) {
			recipe = importedRecipes[recipe.url];
			selectedStep++;
			return;
		}

		loadingImport = true;
		const response = await axios.get<Recipe>(`/api/recipe/import?url=${recipe.url}`);
		const data = response.data;

		data.collectionId = collectionId;

		importedRecipes[recipe.url] = data;
		recipe = data;

		loadingImport = false;
		selectedStep++;
	}

	let loading = false;
	async function addRecipeHandler() {
		if (!$currentUser) return;

		loading = true;

		let formData = new FormData();
		if (files && files.length > 0) formData.append('cover', files[0]);

		// Remove empty buffer fields at end from array inputs
		recipe.ingredients = Object.fromEntries(
			Object.entries(recipe.ingredients).map(([key, value]) => [
				key,
				value.filter((ingredient) => !ingredient.amount || ingredient.name !== '')
			])
		);
		recipe.description.pop();

		recipe.creatorId = $currentUser.uid;

		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection($currentUser, formData, collectionId);
		loading = false;
	}
</script>

<svelte:head>
	<title>
		{mode === 'CREATE' ? 'Neues Rezept hinzufügen' : 'Rezept bearbeiten'} | Cooking Cache
	</title>
</svelte:head>

<Header
	title={mode === 'CREATE' ? 'Neues Rezept hinzufügen' : 'Rezept bearbeiten'}
	backLink={mode === 'CREATE'
		? `/recipes/${shortId}`
		: `/recipe/${shortId}/${generateShortRecipeId(
				recipe,
				$recipeCollectionsStore[recipe.collectionId].recipes
		  )}`}
/>

<ul class="steps my-6">
	{#each steps as step, index}
		<button
			class="step"
			class:step-primary={index <= selectedStep}
			on:click={() => (selectedStep = index)}
		>
			<p class:opacity-0={Capacitor.isNativePlatform() && selectedStep !== index}>{step}</p>
		</button>
	{/each}
</ul>

<div class="grid grid-cols-fluid items-center gap-2 pb-20">
	{#if steps[selectedStep] === 'Import'}
		<ImportStep bind:recipe bind:importRecipe {mode} />
	{:else if steps[selectedStep] === 'Allgemein'}
		<GeneralStep bind:recipe bind:files />
	{:else if steps[selectedStep] === 'Tags'}
		<TagStep bind:recipe />
	{:else if steps[selectedStep] === 'Zutaten'}
		<IngredientStep bind:recipe />
	{:else if steps[selectedStep] === 'Zubereitung'}
		<DescriptionStep bind:recipe />
	{:else if steps[selectedStep] === 'Vorschau'}
		<div class="col-span-full">
			<RecipePage {recipe} />
		</div>
	{/if}
</div>

<div class="fixed z-20 bottom-0 pb-20 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-base-100">
	<div class="flex gap-2 mt-6 w-full">
		{#if selectedStep > 0}
			<button class="btn btn-ghost flex-2" on:click={() => (selectedStep -= 1)} disabled={loading}>
				Zurück
			</button>
		{/if}

		{#if steps[selectedStep] === 'Import'}
			<button
				class="btn btn-primary flex-1"
				on:click={importRecipeFromUrl}
				disabled={loadingImport}
			>
				{#if !loadingImport}
					Weiter
				{:else}
					<span class="loading loading-spinner loading-md" />
				{/if}
			</button>
		{:else if selectedStep < steps.length - 1}
			<button
				class="btn btn-primary flex-1"
				on:click={() => (selectedStep += 1)}
				disabled={loading}
			>
				Weiter
			</button>
		{/if}
		{#if selectedStep === steps.length - 1}
			<button
				class="btn btn-primary flex-1"
				on:click={addRecipeHandler}
				disabled={formIsInvalid(recipe) || loading}
			>
				{#if !loading}
					{mode === 'CREATE' ? 'Hinzufügen' : 'Speichern'}
				{:else}
					<span class="loading loading-spinner loading-md" />
				{/if}
			</button>
		{/if}
	</div>
</div>
