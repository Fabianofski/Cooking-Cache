<script lang="ts">
	import type { Recipe } from '../../../models/Recipe';
	import RecipePage from '../[id]/RecipePage.svelte';

	let editMode = true;

	let recipe: Recipe = {
		image: '',
		title: '',
		tagline: '',
		tags: [],
		ingredients: [],
		description: '',
		id: '',
		url: ''
	};
</script>

<div class="join">
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
		<div class="grid grid-cols-fluid">
			<div class="form-control w-full max-w-xs">
				<label class="label" for="">
					<span class="label-text">Cover</span>
				</label>
				<input type="file" class="file-input w-full max-w-xs" />
			</div>
			<div class="form-control w-full max-w-xs">
				<label class="label" for="">
					<span class="label-text">Titel</span>
				</label>
				<input
					type="text"
					placeholder="Cheeseburger.."
					class="input input-bordered w-full max-w-xs"
					bind:value={recipe.title}
				/>
			</div>
			<div class="form-control w-full max-w-xs">
				<label class="label" for="">
					<span class="label-text">Rezept URL</span>
				</label>
				<input
					type="text"
					placeholder="https://www.chefkoch.de/.."
					class="input input-bordered w-full max-w-xs"
					bind:value={recipe.url}
				/>
			</div>
			<div class="form-control w-full max-w-xs">
				<label class="label" for="">
					<span class="label-text">Tags (getrennt durch Komma)</span>
				</label>
				<input
					type="text"
					placeholder="Cheeseburger.."
					class="input input-bordered w-full max-w-xs"
					on:input={(e) => {
						recipe.tags = e.target?.value.split(',');
					}}
				/>
			</div>
			<div class="form-control w-full max-w-xs">
				<label class="label" for="">
					<span class="label-text">Tagline</span>
				</label>
				<input
					type="text"
					placeholder="Da best in da west.."
					class="input input-bordered w-full max-w-xs"
					bind:value={recipe.tagline}
				/>
			</div>
			<div class="form-control">
				<label class="label" for="">
					<span class="label-text">Rezept</span>
				</label>
				<textarea
					class="textarea textarea-bordered h-24 max-w-xs"
					placeholder="1. ... 2. ... 3. ..."
				/>
			</div>
		</div>

		<button class="btn btn-primary max-w-xs mt-6">Hinzufügen</button>
	</div>
</div>
<div class={`${editMode ? 'hidden' : 'visible'}`}>
	<RecipePage {recipe} />
</div>
