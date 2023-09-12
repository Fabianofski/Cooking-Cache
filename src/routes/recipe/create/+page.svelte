<script lang="ts">
	import type { Recipe } from '../../../models/Recipe';
	import { recipesStore } from '../../../stores/store';
	import RecipePage from '../[id]/RecipePage.svelte';

	let editMode = true;
	let files: FileList | null = null;
	let recipe: Recipe = {
		image: '',
		title: '',
		tagline: '',
		tags: [],
		ingredients: [{ amount: '', name: '' }],
		description: '',
		id: '',
		url: ''
	};

	function ingredientInputChanged(e: Event, i: number) {
		for (let j = i + 2 - recipe.ingredients.length; j > 0; j--) {
			recipe.ingredients = [...recipe.ingredients, { amount: '', name: '' }];
		}

		let count = -1;
		for (let j = recipe.ingredients.length - 1; j >= 0; j--) {
			const ingredient = recipe.ingredients[j];
			if (ingredient.name !== '' || ingredient.amount != '') break;
			count++;
		}
		recipe.ingredients = recipe.ingredients.slice(0, recipe.ingredients.length - count);
	}

	function addRecipeHandler() {
		recipesStore.update((value) => [...value, recipe]);
	}
</script>

<div class="join mb-2">
	<input
		class="join-item btn"
		type="radio"
		name="options"
		aria-label="Edit"
		value={true}
		bind:group={editMode}
	/>
	<input
		class="join-item btn"
		type="radio"
		name="options"
		aria-label="Preview"
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
					<span class="label-text">Titel</span>
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
						recipe.tags = e.target?.value.split(',');
					}}
				/>
			</div>
			<div class="form-control w-full">
				<label class="label" for="">
					<span class="label-text">Tagline</span>
				</label>
				<input
					type="text"
					placeholder="Da best in da west.."
					class="input input-bordered w-full"
					bind:value={recipe.tagline}
				/>
			</div>
			<div class="form-control w-full col-span-full">
				<label class="label" for="">
					<span class="label-text">Zutaten</span>
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
								<td class="pl-0 pr-1"
									><input
										type="text"
										placeholder="1"
										class="input input-bordered w-full"
										bind:value={recipe.ingredients[i].amount}
										on:input={(e) => ingredientInputChanged(e, i)}
									/></td
								>
								<td class="pl-1 pr-0"
									><input
										type="text"
										placeholder="Tomate"
										class="input input-bordered w-full"
										bind:value={recipe.ingredients[i].name}
										on:input={(e) => ingredientInputChanged(e, i)}
									/></td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="form-control col-span-full">
				<label class="label" for="">
					<span class="label-text">Rezept</span>
				</label>
				<textarea
					class="textarea textarea-bordered h-24 whitespace-pre-line"
					placeholder={'1. ... \n2. ... \n3. ...'}
					bind:value={recipe.description}
				/>
			</div>
		</div>

		<button class="btn btn-primary mt-6" on:click={addRecipeHandler}>Hinzufügen</button>
	</div>
</div>
<div class={`${editMode ? 'hidden' : 'visible'}`}>
	<RecipePage {recipe} />
</div>
