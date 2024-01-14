<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';

	export let recipe: Recipe | undefined;
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
			{#if recipe.tags}
				<div class="card-actions justify-end">
					{#each recipe.tags as tag}
						<div class="badge badge-outline">{tag}</div>
					{/each}
				</div>
			{/if}
		{:else}
			<div class="skeleton h-6 w-16 rounded mt-2" />
			<div class="card-actions justify-end">
				{#each Array(2) as _}
					<div class="skeleton w-8 badge" />
				{/each}
			</div>
		{/if}
	</h2>
	{#if recipe}
		<p>{recipe.tagline === '' ? 'Rezept Untertitel' : recipe.tagline}</p>
		<a href={recipe.url} class={`btn btn-primary`} class:btn-disabled={recipe.url === ''}>
			<img class="h-6" src="/link.svg" alt="link" />
			Zum Originalrezept
		</a>
	{:else}
		<div class="skeleton h-5 w-32 rounded" />
		<div class="skeleton h-12 w-full rounded" />
	{/if}

	<div class="overflow-x-auto">
		<table class="table">
			<thead>
				<tr>
					<th>Anzahl</th>
					<th>Zutat</th>
				</tr>
			</thead>
			<tbody>
				{#if recipe}
					{#each recipe.ingredients as ingredient}
						<tr class="hover">
							<td>{ingredient.amount}</td>
							<td class="font-bold">{ingredient.name}</td>
						</tr>
					{/each}
				{:else}
					{#each Array(3) as _}
						<tr>
							<td class="skeleton rounded-sm p-6" />
							<td class="skeleton rounded-sm p-6" />
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<div class="divider" />

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
					{#each recipe?.description || [] as step, index}
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
