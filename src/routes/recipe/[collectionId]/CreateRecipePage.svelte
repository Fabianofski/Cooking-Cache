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

	let editMode = true;
	let files: FileList | null = null;

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

<div class="join w-full">
	<input
		class="btn flex-1 join-item"
		type="radio"
		name="options"
		aria-label="Bearbeiten"
		value={true}
		bind:group={editMode}
	/>
	<input
		class="btn flex-1 join-item"
		type="radio"
		name="options"
		aria-label="Vorschau"
		value={false}
		bind:group={editMode}
	/>
</div>
<div class={`pt-4 ${editMode ? 'visible' : 'hidden'}`}>
	<div>
		{#if mode === 'CREATE'}
			<h2 class="card-title">Neues Rezept hinzufügen:</h2>
		{:else}
			<h2 class="card-title">Rezept bearbeiten:</h2>
		{/if}
		<div class="grid grid-cols-fluid gap-2">
			<GeneralStep bind:recipe bind:files />
			<TagStep bind:recipe />
			<IngredientStep bind:recipe />
			<DescriptionStep bind:recipe />
		</div>

		<div class="flex gap-2 mt-6 w-full">
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
			<a
				class="btn btn-ghost flex-2"
				href={mode === 'CREATE'
					? `/recipes/${recipe.collectionId}`
					: `/recipe/${recipe.collectionId}/${recipe.id}`}
			>
				Abbrechen
			</a>
		</div>
	</div>
</div>
<div class={`${editMode ? 'hidden' : 'visible'}`}>
	<RecipePage {recipe} />
</div>
