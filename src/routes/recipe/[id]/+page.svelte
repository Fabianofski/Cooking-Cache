<script lang="ts">
	export let data;
</script>

<div class="card w-full bg-base-100 shadow-xl">
	<figure class="w-full max-h-96 flex items-center flex-col">
		<img
			class="w-full max-w-xl"
			src={data.recipe.image}
			alt={`${data.recipe.title} Cover`}
			style="object-fit: cover;"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			{data.recipe.title}
			<div class="card-actions justify-end">
				{#each data.recipe.tags as tag}
					<div class="badge badge-outline">{tag}</div>
				{/each}
			</div>
		</h2>
		<p>{data.recipe.tagline}</p>
		<a href={data.recipe.url} class="btn btn-primary">
			<img class="h-6" src="/link.svg" alt="link" /> Zum Originalrezept
		</a>
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Zutat</th>
						<th>Anzahl</th>
					</tr>
				</thead>
				<tbody>
					{#each data.recipe.ingredients as ingredient}
						<tr class="hover">
							<th>{ingredient.name}</th>
							<td>{ingredient.amount}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p>
			{data.recipe.description}
		</p>
	</div>
</div>
