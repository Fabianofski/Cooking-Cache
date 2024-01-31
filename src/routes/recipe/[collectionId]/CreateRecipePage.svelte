<script lang="ts">
	import { addRecipeToCollection } from '$lib/recipe.handler';
	import type { User } from 'firebase/auth';
	import { createNewAlert } from '../../../components/alerts/alert.handler';
	import type { Recipe } from '../../../models/Recipe';
	import { currentUser } from '../../../stores/store';
	import RecipePage from './[id]/RecipePage.svelte';
	import GeneralStep from './wizard/GeneralStep.svelte';
	import TagStep from './wizard/TagStep.svelte';
	import IngredientStep from './wizard/IngredientStep.svelte';
	import DescriptionStep from './wizard/DescriptionStep.svelte';

	let files: FileList | null = null;
	let steps: string[] = ['Allgemein', 'Tags', 'Zutaten', 'Zubereitung', 'Vorschau'];
	let selectedStep = 0;

	export let mode: 'CREATE' | 'EDIT' = 'CREATE';
	export let collectionId: string;
	export let recipe: Recipe = {
		image: '',
		title: '',
		tagline: '',
		tags: [],
		ingredients: { Default: [{ amount: undefined, name: '', unit: '' }] },
		url: '',
		createdTime: new Date().toISOString(),
		updatedTime: new Date().toISOString(),
		difficulty: 'medium',
		numberOfServings: 4,
		description: [],
		id: '',
		collectionId: collectionId,
		creatorId: ''
	};

	let user: User;
	currentUser.subscribe((value) => {
		if (value) user = value;
	});

	function formIsInvalid(recipe: Recipe) {
		return recipe.title === '' || recipe.tagline === '' || recipe.description[0] === '';
	}

	let loading = false;
	async function addRecipeHandler() {
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

		recipe.creatorId = user.uid;

		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection(user, formData, collectionId);
		loading = false;
	}
</script>

<div class="text-lg font-bold text-center mb-2">
	{#if mode === 'CREATE'}
		<h2>Neues Rezept hinzufügen</h2>
	{:else}
		<h2>Rezept bearbeiten:</h2>
	{/if}
</div>

<ul class="steps transition-all">
	{#each steps as step, index}
		<li class="step transition-all" class:step-primary={index <= selectedStep}>{step}</li>
	{/each}
</ul>
<div>
	<div>
		<div class="grid grid-cols-fluid gap-2">
			{#if steps[selectedStep] === 'Allgemein'}
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

		<div class="flex gap-2 mt-6 w-full">
			{#if selectedStep > 0}
				<button
					class="btn btn-ghost flex-2"
					on:click={() => (selectedStep -= 1)}
					disabled={loading}
				>
					Zurück
				</button>
			{/if}
			{#if selectedStep < steps.length - 1}
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
		<div class="flex justify-center mt-6 w-full">
			<a
				class="btn btn-ghost"
				href={mode === 'CREATE'
					? `/recipes/${recipe.collectionId}`
					: `/recipe/${recipe.collectionId}/${recipe.id}`}
			>
				Abbrechen
			</a>
		</div>
	</div>
</div>
