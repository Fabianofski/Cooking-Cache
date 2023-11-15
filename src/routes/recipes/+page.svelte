<script lang="ts">
	import type { User } from 'firebase/auth';
	import RecipeCard from '../../components/RecipeCard.svelte';
	import type { Recipe } from '../../models/Recipe';
	import { currentUser, recipesStore } from '../../stores/store';

	let recipes: Recipe[] = [];
	recipesStore.subscribe((value) => {
		recipes = [...value];
	});

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let page = 0;
	let pageSize = 6;
	function getRecipesFromPage(recipes: Recipe[], page: number): Recipe[] {
		const startIndex = page * pageSize;
		const endIndex = Math.min(startIndex + pageSize, recipes.length);

		return recipes.slice(startIndex, endIndex);
	}
</script>

<div class="flex gap-4 flex-col items-center">
	<div class="grid grid-cols-fluid gap-6 w-full justify-center mt-4">
		{#each getRecipesFromPage(recipes, page) as recipe}
			<RecipeCard {recipe} />
		{/each}
	</div>
	<div class="join justify-center">
		<a href="#top" class="join-item btn" on:click={() => page--} class:btn-disabled={page <= 0}>
			«
		</a>
		<button class="join-item btn">Page {page + 1}</button>
		<a
			href="#top"
			class="join-item btn"
			on:click={() => page++}
			class:btn-disabled={(page + 1) * pageSize >= recipes.length}
		>
			»
		</a>
	</div>
</div>

<div class="fixed max-w-3xl w-full bottom-0">
	<a
		class="btn btn-circle btn-primary absolute bottom-20 right-6"
		href="/recipe/create"
		class:btn-disabled={user === null}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="24"
			viewBox="0 -960 960 960"
			width="24"
			fill="currentColor"
		>
			<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
		</svg>
	</a>
</div>
