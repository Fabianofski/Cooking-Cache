<script lang="ts">
	import { addRecipeToCollection } from '$lib/recipe.handler';
	import type { User } from 'firebase/auth';
	import { createNewAlert } from '../../../components/alerts/alert.handler';
	import type { Recipe } from '../../../models/Recipe';
	import { currentUser } from '../../../stores/store';
	import RecipePage from './[id]/RecipePage.svelte';

	let editMode = true;
	let files: FileList | null = null;
	let fileInput: HTMLInputElement;
	$: if (files) {
		if (!(files[0]['type'].split('/')[0] === 'image')) {
			createNewAlert({
				message: `Das Cover vom Rezept muss eine Bilddatei sein!`,
				type: 'error'
			});
			files = null;
			fileInput.value = '';
		} else recipe.image = URL.createObjectURL(files[0]);
	}

	export let mode: 'CREATE' | 'EDIT' = 'CREATE';
	export let collectionId: string;
	export let recipe: Recipe = {
		image: '',
		title: '',
		tagline: '',
		tags: [],
		ingredients: [{ amount: '', name: '' }],
		description: [''],
		id: '',
		url: '',
		collectionId: collectionId,
		creatorId: ''
	};
	ingredientInputChanged(recipe.ingredients.length - 1);
	stepInputChanged(recipe.description.length - 1);

	let user: User;
	currentUser.subscribe((value) => {
		if (value) user = value;
	});

	function formIsInvalid(recipe: Recipe) {
		return (
			recipe.title === '' ||
			recipe.tagline === '' ||
			recipe.ingredients[0].amount === '' ||
			recipe.ingredients[0].name === '' ||
			recipe.description[0] === ''
		);
	}

	function ingredientInputChanged(index: number) {
		if (index + 1 === recipe.ingredients.length) recipe.ingredients.push({ amount: '', name: '' });

		let count = -1;
		for (let j = recipe.ingredients.length - 1; j >= 0; j--) {
			const ingredient = recipe.ingredients[j];
			if (ingredient.name !== '' || ingredient.amount !== '') break;
			count++;
		}
		recipe.ingredients = recipe.ingredients.slice(0, recipe.ingredients.length - count);
	}

	function stepInputChanged(index: number) {
		if (index + 1 === recipe.description.length && recipe.description[index] !== '')
			recipe.description.push('');

		let count = -1;
		for (let j = recipe.description.length - 1; j >= 0; j--) {
			const step = recipe.description[j];
			if (step !== '') break;
			count++;
		}
		recipe.description = recipe.description.slice(0, recipe.description.length - count);
	}

	let loading = false;
	async function addRecipeHandler() {
		loading = true;

		let formData = new FormData();
		if (files && files.length > 0) formData.append('cover', files[0]);

		// Remove empty buffer fields at end from array inputs
		recipe.ingredients.pop();
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
		<div class="form-control w-full">
			<label class="label" for="">
				<span class="label-text">Cover</span>
			</label>
			<input
				accept="image/png, image/jpeg"
				bind:this={fileInput}
				bind:files
				type="file"
				class="file-input w-full"
			/>
		</div>
		<div class="grid grid-cols-fluid gap-2">
			<div class="form-control w-full">
				<label class="label" for="">
					<span class="label-text">Titel*</span>
				</label>
				<input
					type="text"
					placeholder="Cheeseburger.."
					class="input input-bordered w-full"
					bind:value={recipe.title}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="">
					<span class="label-text">Tagline*</span>
				</label>
				<input
					type="text"
					placeholder="Da best in da west.."
					class="input input-bordered w-full"
					bind:value={recipe.tagline}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="">
					<span class="label-text">Rezept URL</span>
				</label>
				<input
					type="text"
					placeholder="https://www.chefkoch.de/.."
					class="input input-bordered w-full"
					bind:value={recipe.url}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="">
					<span class="label-text">Tags (getrennt durch Komma)</span>
				</label>
				<input
					type="text"
					placeholder="Mittag, Abend, Frühstück.."
					class="input input-bordered w-full"
					on:input={(e) => {
						//@ts-ignore
						recipe.tags = e.target?.value.split(',');
					}}
				/>
			</div>
			<div class="form-control w-full col-span-full">
				<label class="label" for="">
					<span class="label-text">Zutaten*</span>
				</label>
				<table class="table">
					<thead>
						<tr>
							<th>Anzahl</th>
							<th>Zutat</th>
						</tr>
					</thead>
					<tbody>
						{#each { length: recipe.ingredients.length } as _, i}
							<tr>
								<td class="pl-0 pr-1">
									<input
										type="text"
										placeholder="1"
										class="input input-bordered w-full"
										bind:value={recipe.ingredients[i].amount}
										on:input={(e) => ingredientInputChanged(i)}
									/>
								</td>
								<td class="pl-1 pr-0">
									<input
										type="text"
										placeholder="Tomate"
										class="input input-bordered w-full"
										bind:value={recipe.ingredients[i].name}
										on:input={(e) => ingredientInputChanged(i)}
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="form-control col-span-full">
				<label class="label" for="">
					<span class="label-text">Rezept Beschreibung*</span>
				</label>
				<div class="flex flex-col gap-2">
					{#each recipe.description as { }, index}
						<div class="flex">
							<p class="p-2 font-bold w-8 text-center">
								{index + 1}.
							</p>
							<textarea
								class="textarea textarea-bordered h-12 w-full"
								placeholder={'Schritt 1'}
								bind:value={recipe.description[index]}
								on:input={() => {
									stepInputChanged(index);
								}}
							/>
						</div>
					{/each}
				</div>
			</div>
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
