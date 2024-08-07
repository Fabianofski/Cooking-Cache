<script lang="ts">
	import { page } from '$app/stores';
	import { difficultyLabels, type Recipe } from '../../../../models/Recipe';
	import { generateRecipeAccessToken, getBringImportLink } from '$lib/http/recipe.handler';
	import { currentUser } from '../../../../stores/store';

	export let recipe: Recipe | undefined;

	let numberOfServings = recipe?.numberOfServings || 4;
	function getIngredientPerServing(amount: number | undefined, numberOfServings: number) {
		if (numberOfServings < 0) numberOfServings = -numberOfServings;
		if (!numberOfServings) numberOfServings = recipe?.numberOfServings || 4;

		const multiplier = numberOfServings / (recipe?.numberOfServings || 4);
		const amountPerServing = Number((multiplier * (amount || 0)).toFixed(2));
		return amountPerServing === 0 ? '' : amountPerServing;
	}

	function convertIngredientsToArray(recipe: Recipe) {
		const ingredients = [];
		for (const category in recipe.ingredients) {
			for (const ingredient of recipe.ingredients[category]) {
                const amount = !ingredient.amount || ingredient.amount === 0 ? '' : ingredient.amount + ' ';
                const unit = ingredient.unit ? ingredient.unit + ' ' : '';
				ingredients.push(`${amount}${unit}${ingredient.name}`);
			}
		}
		return ingredients;
	}

	function getJsonLd(recipe: Recipe) {
		const data = JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Recipe',
			author: 'Cooking Cache',
			totalTime: `PT${recipe.cookingTime}M`,
			datePublished: recipe.createdTime?.split('T')[0] || new Date(),
			image: recipe.image,
			recipeIngredient: convertIngredientsToArray(recipe),
			name: recipe.title,
			recipeInstructions: (recipe.description || []).join('\n'),
			recipeYield: recipe.numberOfServings
		}, null, 2);
		return `<script type="application/ld+json">${data}<\/script>`;
	}

	let bringImportLink: string | undefined = '';

	$: recipe, numberOfServings, createBringLink();
	async function createBringLink() {
		if ($page.url.pathname.includes('/create')) return;
		if (!recipe) return;

		bringImportLink = '';
		let url: string;

		if ($page.url.pathname.startsWith('/daily')) {
			url = 'https://cooking-cache.web.app/daily/ssr';
		} else {
			if (!recipe.accessToken) {
				if (!$currentUser) return;
				const newToken = await generateRecipeAccessToken(
					$currentUser,
					recipe.collectionId,
					recipe.id
				);
				if (!newToken) return;
				recipe.accessToken = newToken;
			}

			url = `https://cooking-cache.web.app/recipe/${recipe?.collectionId}/${recipe?.id}/share?key=${recipe?.accessToken}`;
		}

		bringImportLink = await getBringImportLink(
			url,
			recipe?.numberOfServings || 4,
			numberOfServings
		);
	}
</script>

<svelte:head>
	{#if recipe}
		{@html getJsonLd(recipe)}
	{/if}
</svelte:head>

{#if recipe}
	<figure class="w-full max-h-72 flex items-center flex-col mt-4">
		<img
			class="w-full h-full max-h-72 rounded object-cover"
			src={recipe.image === '' ? '/default-cover.jpg' : recipe.image}
			alt={`${recipe.title} Cover`}
		/>
	</figure>
	<h1 class="font-bold text-2xl mt-4">{recipe.title}</h1>
{:else}
	<div class="skeleton h-72 w-full rounded mt-4 self-center" />
{/if}
<div class="card-body px-0 pt-2">
	{#if recipe}
		<div class="flex gap-2">
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
				<p>
					{recipe.cookingTime >= 60
						? Math.floor(recipe.cookingTime / 60) + 'h '
						: ''}{recipe.cookingTime % 60}m
				</p>
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
				{#each recipe.tags.filter((x) => x !== '').slice(0, 4) as tag}
					<div class="badge badge-outline">{tag}</div>
				{/each}
				{#if recipe.tags.length > 4}
					<div class="badge badge-neutral">+{recipe.tags.length - 4}</div>
				{/if}
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
				<table class="table px-8">
					<tbody>
						{#each recipe.ingredients[category] as ingredient}
							{#if ingredient.name !== ''}
								<tr class="hover">
									<td class="w-[40%] max-w-52 pl-16">
										<strong>
											{getIngredientPerServing(ingredient.amount, numberOfServings)}
										</strong>
										{ingredient.unit || ''}
									</td>
									<td class="font-bold pl-16">{ingredient.name}</td>
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

	<div class="flex justify-center">
		<a
			href={bringImportLink}
			target="_blank"
			class:btn-disabled={bringImportLink === ''}
			class="btn bg-[#37474f] hover:bg-[#304047] w-full max-w-sm text-white font-bold"
		>
			<img class="h-8" src="/bring.png" alt="bring" />
			Auf Einkaufsliste setzen!
		</a>
	</div>

	<div class="divider" />

	<h2 class="font-bold text-lg">Nährwerte pro Portion</h2>
	<div class="flex flex-wrap gap-8">
		<div class="flex flex-col items-center gap-2">
			<span class="font-bold">Kalorien</span>
			<span>{recipe?.nutrition?.calories || '0'} kcal</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<span class="font-bold">Proteine</span>
			<span>{recipe?.nutrition?.protein || '0'} g</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<span class="font-bold">Kohlenhydrate</span>
			<span>{recipe?.nutrition?.carbs || '0'} g</span>
		</div>
		<div class="flex flex-col items-center gap-2">
			<span class="font-bold">Fette</span>
			<span>{recipe?.nutrition?.fat || '0'} g</span>
		</div>
	</div>

	<div class="divider" />
	<h2 class="font-bold text-lg">Zubereitung</h2>

	<div class="px-4">
		{#if recipe}
			{#each recipe?.description?.filter((x) => x.trim() != '') || [] as step, index}
				<div class="flex mb-2">
					<span class="text-xl w-8">{index + 1}.</span>
					<span class="self-center text-justify text-sm w-full">{step}</span>
				</div>
			{/each}
		{:else}
			{#each Array(3) as _}
				<span class="skeleton rounded-sm p-6" />
				<span class="skeleton rounded-sm p-6" />
				<span class="skeleton rounded-sm p-6" />
			{/each}
		{/if}
	</div>
</div>

<style>
	:global(.bring-import-link-dark) {
		width: 100%;
		max-width: none !important;
	}
</style>
