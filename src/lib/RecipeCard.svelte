<script lang="ts">
	import type { Recipe } from '../models/Recipe';

	export let recipe: Recipe;
</script>

<a href="/">
	<div class="card w-full h-96 bg-base-100 shadow-xl">
		<figure>
			<img src={recipe.image} alt="Burger" style="object-fit: cover;" />
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
			<p>{recipe.description}</p>
		</div>
	</div>
</a>
