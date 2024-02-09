<script lang="ts">
	import { difficultyLabels, type Recipe } from '../../../../models/Recipe';

	export let recipe: Recipe | undefined;
	let numberOfServings = recipe?.numberOfServings || 4;

	function getIngredientPerServing(amount: number, numberOfServings: number) {
		if (numberOfServings < 0) numberOfServings = -numberOfServings;
		if (!numberOfServings) numberOfServings = recipe?.numberOfServings || 4;

		const multiplier = numberOfServings / (recipe?.numberOfServings || 4);
		return Number((multiplier * amount).toFixed(2));
	}
</script>

{#if recipe}
	<figure class="w-full max-h-72 flex items-center flex-col mt-4">
		<img
			class="w-full h-full max-h-72 rounded object-cover"
			src={recipe.image === '' ? '/default-cover.jpg' : recipe.image}
			alt={`${recipe.title} Cover`}
		/>
	</figure>
{:else}
	<div class="skeleton h-72 w-full rounded mt-4 self-center" />
{/if}
<div class="card-body px-0">
	<h2 class="card-title">
		{#if recipe}
			{recipe.title === '' ? 'Rezept Titel' : recipe.title}
		{:else}
			<div class="skeleton h-6 w-16 rounded mt-2" />
		{/if}
	</h2>
	{#if recipe}
		<div class="flex gap-2 mt-1">
			<div class="badge badge-neutral h-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 mr-1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
				{recipe.cookingTime || '60'} Minuten
			</div>
			<div class="badge badge-neutral h-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 mr-1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
					/>
				</svg>
				{new Date(recipe.createdTime).toLocaleDateString()}
			</div>
			<div class="badge badge-neutral h-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 mr-1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
					/>
				</svg>
				{difficultyLabels[recipe.difficulty]}
			</div>
		</div>
		{#if recipe.tags}
			<div class="card-actions">
				{#each recipe.tags.filter((x) => x !== '') as tag}
					<div class="badge badge-outline">{tag}</div>
				{/each}
			</div>
		{/if}

		<a href={recipe.url} class={`btn btn-primary mt-1`} class:btn-disabled={recipe.url === ''}>
			<img class="h-6" src="/link.svg" alt="link" />
			Zum Originalrezept
		</a>
	{:else}
		<div class="skeleton h-5 w-32 rounded" />
		<div class="flex gap-2">
			<div class="skeleton h-6 w-16 rounded" />
			<div class="skeleton h-6 w-16 rounded" />
			<div class="skeleton h-6 w-16 rounded" />
		</div>
		<div class="card-actions">
			{#each Array(2) as _}
				<div class="skeleton w-8 badge" />
			{/each}
		</div>
		<div class="skeleton h-12 w-full rounded" />
	{/if}

	<div class="divider" />

	<h2 class="font-bold text-lg">Zutaten</h2>
	<div class="overflow-x-auto">
		<div class="flex justify-between gap-2">
			<p>
				Für <strong>{numberOfServings}</strong>
				{numberOfServings === 1 ? 'Portion' : 'Portionen'}
			</p>
			<div class="join gap-0.5">
				<button
					class="btn btn-primary btn-sm join-item"
					on:click={() => (numberOfServings > 1 ? numberOfServings-- : '')}
					disabled={numberOfServings <= 1}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
					</svg>
				</button>
				<button class="btn btn-primary btn-sm join-item" on:click={() => numberOfServings++}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</button>
			</div>
		</div>
		{#if recipe}
			{#each Object.keys(recipe.ingredients) as category}
				{#if category !== 'Default'}
					<h3 class="font-bold text-md pl-2 mt-2">
						{category}:
					</h3>
				{/if}
				<table class="table">
					<tbody>
						{#each recipe.ingredients[category] as ingredient}
							{#if ingredient.name !== '' && ingredient.amount}
								<tr class="hover">
									<td class="w-48">
										<strong>
											{getIngredientPerServing(ingredient.amount, numberOfServings)}
										</strong>
										{ingredient.unit || ''}
									</td>
									<td class="font-bold">{ingredient.name}</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			{/each}
		{:else}
			<table class="table">
				<thead>
					<tr>
						<th>Menge</th>
						<th>Zutat</th>
					</tr>
				</thead>
				<tbody>
					{#each Array(3) as _}
						<tr>
							<td class="skeleton rounded-sm p-6" />
							<td class="skeleton rounded-sm p-6" />
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<div class="divider" />
	<h2 class="font-bold text-lg">Zubereitung</h2>

	<div class="overflow-x-auto rounded-sm">
		<table class="table rounded-none">
			<thead>
				<tr>
					<th>Schritt</th>
					<th>Beschreibung</th>
					<th>Abgehakt</th>
				</tr>
			</thead>
			<tbody>
				{#if recipe}
					{#each recipe?.description.filter((x) => x.trim() != '') || [] as step, index}
						<tr class="hover">
							<td class="font-bold w-8 text-center">{index + 1}.</td>
							<td class="text-justify w-full">{step}</td>
							<td>
								<div class="flex justify-center align-middle">
									<input type="checkbox" class="checkbox" />
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					{#each Array(3) as _}
						<tr>
							<td class="skeleton rounded-sm p-6" />
							<td class="skeleton rounded-sm p-6" />
							<td class="skeleton rounded-sm p-6" />
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
