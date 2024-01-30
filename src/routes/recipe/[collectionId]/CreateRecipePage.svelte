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
	let editingCategoryName: {
		[key: string]: {
			editing: boolean;
			name: string;
		};
	} = {};

	stepInputChanged(recipe.description.length - 1);

	let user: User;
	currentUser.subscribe((value) => {
		if (value) user = value;
	});

	function formIsInvalid(recipe: Recipe) {
		return recipe.title === '' || recipe.tagline === '' || recipe.description[0] === '';
	}

	function addIngredientToCategroy(category: string) {
		recipe.ingredients[category] = [
			...recipe.ingredients[category],
			{ amount: undefined, name: '', unit: '' }
		];
	}

	let newCategory: string = '';
	function addIngredientCategory(e: Event | undefined = undefined) {
		if (
			newCategory === '' ||
			newCategory in recipe.ingredients ||
			(e && (<KeyboardEvent>e).key !== 'Enter')
		)
			return;

		recipe.ingredients = {
			...recipe.ingredients,
			[newCategory]: [{ amount: undefined, name: '', unit: '' }]
		};
		editingCategoryName[newCategory] = { editing: false, name: newCategory };
		newCategory = '';
	}

	function updateCategoryName(category: string, e: Event | undefined = undefined) {
		if (e && (<KeyboardEvent>e).key === 'Escape') {
			editingCategoryName[category].name = category;
			editingCategoryName[category].editing = false;
			return;
		}

		if (
			editingCategoryName[category].name === '' ||
			editingCategoryName[category].name in recipe.ingredients ||
			(e && (<KeyboardEvent>e).key !== 'Enter')
		)
			return;

		const categoryInfo = editingCategoryName[category];
		recipe.ingredients[categoryInfo.name] = recipe.ingredients[category];
		editingCategoryName[categoryInfo.name] = { editing: false, name: categoryInfo.name };

		delete recipe.ingredients[category];
		delete editingCategoryName[category];
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

			<div class="form-control w-full">
				<label class="label" for="">
					<span class="label-text">Anzahl der Portionen*</span>
				</label>
				<div class="join">
					<div class="join-item bg-base-300 px-6 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-8 h-8"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
							/>
						</svg>
					</div>

					<input
						type="number"
						placeholder="4"
						min="0"
						class="join-item input input-bordered w-full"
						bind:value={recipe.numberOfServings}
					/>

					<span class="join-item flex items-center bg-base-300 px-6">Portionen</span>
				</div>
			</div>
			<div class="form-control w-full">
				<label class="label" for="">
					<span class="label-text">Zubereitungszeit*</span>
				</label>
				<div class="join">
					<div class="join-item bg-base-300 px-6 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-8 h-8"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					</div>

					<input
						type="number"
						placeholder="60"
						min="0"
						class="join-item input input-bordered w-full"
						bind:value={recipe.cookingTime}
					/>

					<span class="join-item flex items-center bg-base-300 px-6">Minuten</span>
				</div>
			</div>

			<div class="form-control w-full">
				<label class="label" for="">
					<span class="label-text">Schwierigkeit*</span>
				</label>
				<div class="join">
					<div class="join-item bg-base-300 px-6 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-8 h-8"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
							/>
						</svg>
					</div>

					<input
						class="btn btn-ghost input-bordered flex-1 join-item"
						type="radio"
						name="difficulty"
						aria-label="Einfach"
						value={'easy'}
						bind:group={recipe.difficulty}
					/>
					<input
						class="btn btn-ghost input-bordered flex-1 join-item"
						type="radio"
						name="difficulty"
						aria-label="Mittel"
						value={'medium'}
						bind:group={recipe.difficulty}
					/>
					<input
						class="btn btn-ghost input-bordered flex-1 join-item"
						type="radio"
						name="difficulty"
						aria-label="Schwer"
						value={'hard'}
						bind:group={recipe.difficulty}
					/>
				</div>
			</div>

			<div class="form-control w-full col-span-full">
				<label class="label" for="">
					<span class="label-text">Zutaten*</span>
				</label>
				{#each Object.keys(recipe.ingredients) as category}
					{#if category !== 'Default'}
						<div class="flex items-center gap-1">
							{#if editingCategoryName[category]?.editing}
								<input
									type="text"
									placeholder="z.B. Für den Teig"
									class="input input-bordered input-sm w-36"
									bind:value={editingCategoryName[category].name}
									on:keyup={(e) => {
										updateCategoryName(category, e);
									}}
								/>
								<button
									class="btn btn-ghost btn-sm"
									on:click={() => updateCategoryName(category)}
									disabled={editingCategoryName[category].name === ''}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-5 h-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M4.5 12.75l6 6 9-13.5"
										/>
									</svg>
								</button>
							{:else}
								<h3 class="align-middle text-sm">{category}</h3>
								<button
									class="btn btn-ghost btn-sm"
									on:click={() => (editingCategoryName[category].editing = true)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-5 h-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
										/>
									</svg>
								</button>
							{/if}
						</div>
					{/if}
					<table class="table">
						<thead>
							<tr>
								<th class="pl-0 pt-0.5">Menge</th>
								<th class="pl-0 pt-0.5">Einheit</th>
								<th class="pl-0 pt-0.5">Zutat</th>
							</tr>
						</thead>
						<tbody>
							{#each { length: recipe.ingredients[category].length } as _, i}
								<tr>
									<td class="pl-0 pr-0.5 py-0 w-36">
										<input
											type="number"
											placeholder="1"
											class="input input-sm input-bordered w-full"
											required
											bind:value={recipe.ingredients[category][i].amount}
										/>
									</td>
									<td class="pl-0 pr-0.5 py-0 w-36">
										<input
											type="text"
											placeholder="Packung"
											class="input input-sm input-bordered w-full"
											bind:value={recipe.ingredients[category][i].unit}
										/>
									</td>
									<td class="pl-0.5 pr-0 py-0">
										<input
											type="text"
											placeholder="Backpulver"
											class="input input-sm input-bordered w-full"
											required
											bind:value={recipe.ingredients[category][i].name}
										/>
									</td>
								</tr>
							{/each}
							<tr>
								<td class="p-0">
									<button
										class="btn btn-neutral btn-sm w-32 my-1"
										on:click={() => {
											addIngredientToCategroy(category);
										}}
									>
										+
									</button>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="divider my-0.5" />
				{/each}
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Kategorie hinzufügen</span>
					</div>
					<input
						type="text"
						placeholder="z.B. Für den Teig"
						class="input input-bordered input-sm w-36"
						bind:value={newCategory}
						on:keyup={addIngredientCategory}
					/>
				</label>
				<button
					class="btn btn-neutral btn-sm btn-block my-1"
					disabled={newCategory === '' || newCategory in recipe.ingredients}
					on:click={() => {
						addIngredientCategory();
					}}
				>
					+
				</button>
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
