<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';

	export let recipe: Recipe;
	if (!recipe.nutrition) recipe.nutrition = {};

	let editingCategoryName: {
		[key: string]: {
			editing: boolean;
			name: string;
		};
	} = {};

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
</script>

<h2 class="text-md font-bold mt-2 col-span-full">Zutaten:</h2>
<div class="form-control w-full col-span-full">
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
							viewBox="0 0 32 32"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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
							viewBox="0 0 32 32"
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
								placeholder="0"
								class="input input-bordered input-sm w-full"
								required
								bind:value={recipe.ingredients[category][i].amount}
							/>
						</td>
						<td class="pl-0 pr-0.5 py-0 w-36">
							<input
								type="text"
								placeholder="-"
								class="input input-sm input-bordered w-full"
								bind:value={recipe.ingredients[category][i].unit}
							/>
						</td>
						<td class="pl-0.5 pr-0 py-0">
							<input
								type="text"
								placeholder="Eier"
								class="input input-sm input-bordered w-full"
								required
								bind:value={recipe.ingredients[category][i].name}
							/>
						</td>
						<td class="p-0">
							<button
								class="btn btn-ghost btn-sm"
								on:click={() => {
									recipe.ingredients[category].splice(i, 1);
									recipe.ingredients = { ...recipe.ingredients };
								}}
								disabled={recipe.ingredients[category].length === 1}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 32 32"
									stroke="currentColor"
									class="w-5 h-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
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

<h2 class="text-md font-bold mt-2 col-span-full">Nährwerte pro Portion:</h2>

{#if recipe.nutrition}
	<div class="join">
		<input
			type="number"
			placeholder="0 kcal"
			class="input input-bordered input-sm w-full join-item"
			bind:value={recipe.nutrition.calories}
		/>
		<div class="join-item w-32 bg-base-300 px-6 flex items-center">Kalorien</div>
	</div>
	<div class="join">
		<input
			type="number"
			placeholder="0 g"
			class="input input-bordered input-sm w-full join-item"
			bind:value={recipe.nutrition.protein}
		/>
		<div class="join-item w-32 whitespace-nowrap bg-base-300 px-6 flex items-center">Proteine</div>
	</div>
	<div class="join">
		<input
			type="number"
			placeholder="0 g"
			class="join-item input input-bordered input-sm w-full"
			bind:value={recipe.nutrition.carbs}
		/>
		<div class="join-item w-32 whitespace-nowrap bg-base-300 px-6 flex items-center">Carbs</div>
	</div>
	<div class="join">
		<input
			type="number"
			placeholder="0 g"
			class="input input-bordered input-sm w-full join-item"
			bind:value={recipe.nutrition.fat}
		/>
		<div class="join-item w-32 whitespace-nowrap bg-base-300 px-6 flex items-center">Fette</div>
	</div>
{/if}
