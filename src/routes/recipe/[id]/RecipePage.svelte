<script lang="ts">
	import type { Recipe } from '../../../models/Recipe';

	export let recipe: Recipe;
</script>

<div class="card w-full bg-base-100 shadow-xl">
	<figure class="w-full max-h-96 flex items-center flex-col">
		<img
			class="w-full max-w-xl"
			src={recipe.image === '' ? '/default-cover.jpg' : recipe.image}
			alt={`${recipe.title} Cover`}
			style="object-fit: cover;"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			{recipe.title === '' ? 'Rezept Titel' : recipe.title}
			<div class="card-actions justify-end">
				{#each recipe.tags as tag}
					<div class="badge badge-outline">{tag}</div>
				{/each}
			</div>
		</h2>
		<p>{recipe.tagline === '' ? 'Rezept Untertitel' : recipe.tagline}</p>
		<a href={recipe.url} class={`btn btn-primary ${recipe.url === '' ? 'btn-disabled' : ''}`}>
			<img class="h-6" src="/link.svg" alt="link" /> Zum Originalrezept
		</a>
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Anzahl</th>
						<th>Zutat</th>
					</tr>
				</thead>
				<tbody>
					{#each recipe.ingredients as ingredient}
						<tr class="hover">
							<td>{ingredient.amount}</td>
							<th>{ingredient.name}</th>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="whitespace-pre-line">
			{recipe.description === '' ? '1. ...\n2. ... \n3. ...' : recipe.description}
		</p>
	</div>
</div>
