<script lang="ts">
	import { goto } from '$app/navigation';
	import { createNewAlert } from '../../../../components/alerts/alert.handler';
	import type { Recipe } from '../../../../models/Recipe';
	import { currentUser, recipesStore } from '../../../../stores/store';
	import type { User } from 'firebase/auth';
	import RecipePage from '../../[collection]/[id]/RecipePage.svelte';

	export let data;

	let editMode = true;
	let files: FileList | null = null;
	$: if (files) {
		recipe.image = URL.createObjectURL(files[0]);
	}
	let recipe: Recipe = {
		image: '',
		title: '',
		tagline: '',
		tags: [],
		ingredients: [{ amount: '', name: '' }],
		description: [''],
		id: '',
		url: '',
		collection: data.collection
	};

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

	function ingredientInputChanged(e: Event, index: number) {
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
	function addRecipeHandler() {
		loading = true;

		let formData = new FormData();
		if (files && files.length > 0) formData.append('cover', files[0]);
		// Remove empty buffer fields at end from array inputs
		recipe.ingredients.pop();
		recipe.description.pop();
		formData.append('recipe', JSON.stringify(recipe));

		user.getIdToken().then((token) => {
			fetch('/api/recipe', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json',
					Authorization: token
				}
			})
				.then(async (response: Response) => {
					const recipe = (await response.json()) as Recipe;
					recipesStore.update((value) => {
						value[data.collection].recipes.push(recipe);
						return value;
					});
					loading = false;
					createNewAlert({
						message: 'Das Rezept wurde erfolgreich hinzugefügt!',
						type: 'success'
					});
					goto(`/recipe/${recipe.collection}/${recipe.id}`);
				})
				.catch(() => {
					loading = false;
					createNewAlert({
						message: 'Beim Hinzufügen vom Rezept ist ein Fehler aufgetreten!',
						type: 'error'
					});
				});
		});
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
<div class={`card w-full bg-base-100 shadow-xl ${editMode ? 'visible' : 'hidden'}`}>
	<div class="card-body">
		<h2 class="card-title">Neues Rezept hinzufügen:</h2>
		<div class="form-control w-full">
			<label class="label" for="">
				<span class="label-text">Cover</span>
			</label>
			<input accept="image/png, image/jpeg" bind:files type="file" class="file-input w-full" />
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
										on:input={(e) => ingredientInputChanged(e, i)}
									/>
								</td>
								<td class="pl-1 pr-0">
									<input
										type="text"
										placeholder="Tomate"
										class="input input-bordered w-full"
										bind:value={recipe.ingredients[i].name}
										on:input={(e) => ingredientInputChanged(e, i)}
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
					Hinzufügen
				{:else}
					<span class="loading loading-spinner loading-md" />
				{/if}
			</button>
			<a class="btn btn-ghost flex-2" href="/recipes">Abbrechen</a>
		</div>
	</div>
</div>
<div class={`${editMode ? 'hidden' : 'visible'}`}>
	<RecipePage {recipe} />
</div>
