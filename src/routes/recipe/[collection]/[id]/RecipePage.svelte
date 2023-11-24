<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';

	export let recipe: Recipe;
	console.log(recipe);
</script>

<div class="card w-full bg-base-100 shadow-xl">
	<figure class="w-full max-h-96 flex items-center flex-col mt-4">
		<img
			class="w-full h-full max-w-xl rounded object-cover"
			src={recipe.image === '' ? '/default-cover.jpg' : recipe.image}
			alt={`${recipe.title} Cover`}
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			{recipe.title === '' ? 'Rezept Titel' : recipe.title}
			{#if recipe.tags}
				<div class="card-actions justify-end">
					{#each recipe.tags as tag}
						<div class="badge badge-outline">{tag}</div>
					{/each}
				</div>
			{/if}
		</h2>
		<p>{recipe.tagline === '' ? 'Rezept Untertitel' : recipe.tagline}</p>
		<a href={recipe.url} class={`btn btn-primary ${recipe.url === '' ? 'btn-disabled' : ''}`}>
			<img class="h-6" src="/link.svg" alt="link" />
			 Zum Originalrezept
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
							<td class="font-bold">{ingredient.name}</td>
						</tr>
					{/each}
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
					{#each recipe.description as step, index}
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
				</tbody>
			</table>
		</div>
	</div>
</div>
