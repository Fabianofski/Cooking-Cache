<script lang="ts">
	import type { Recipe } from '../models/Recipe';

	export let recipe: Recipe;
</script>

<a class="w-full" href={`/recipe/${recipe.id}`}>
	<div class="card w-full h-96 bg-base-200 shadow-xl">
		<figure class="h-64 overflow-x-hidden">
			<img
				class="h-full w-full"
				src={recipe.image === '' ? '/default-cover.jpg' : recipe.image}
				alt={`${recipe.title} Cover`}
				style="object-fit: cover;"
			/>
		</figure>
		<div class="card-body">
			<h2 class="card-title">
				{recipe.title}
				<div class="w-full card-actions justify-end">
					{#each recipe.tags as tag}
						<div class="badge badge-outline">{tag}</div>
					{/each}
				</div>
			</h2>
			<p>{recipe.tagline}</p>
		</div>
	</div>
</a>
