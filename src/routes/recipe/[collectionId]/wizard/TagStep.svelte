<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';

	export let recipe: Recipe;
</script>

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
