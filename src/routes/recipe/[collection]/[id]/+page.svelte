<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';
	import { recipesStore } from '../../../../stores/store';
	import RecipePage from './RecipePage.svelte';

	export let data;

	let recipe: Recipe | undefined;
	recipesStore.subscribe((recipes) => {
		recipe = recipes[data.collection].recipes.find((recipe) => recipe.id === data.id);
	});
</script>

{#if recipe}
	<div>
		<div class="w-full bg-base-100">
			<div class="w-full relative">
				<a href={`/recipes/${data.collection}`} class="absolute top-1 l-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
						/>
					</svg>
				</a>
				<h2 class="text-lg font-bold text-center">{recipe.title}</h2>
			</div>
			<div class="divider my-0" />
		</div>
		<RecipePage {recipe} />
	</div>
{:else}
	Error 404
{/if}
