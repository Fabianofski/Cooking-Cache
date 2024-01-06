<script lang="ts">
	import type { User } from 'firebase/auth';
	import RecipeCard from '../../../components/RecipeCard.svelte';
	import type { Recipe } from '../../../models/Recipe';
	import { currentUser, loadingStateStore, type LoadingState } from '../../../stores/store';
	import { fullTextFilter } from './filter';
	import RecipeSkeleton from '../../../components/RecipeSkeleton.svelte';
	import Header from '../../../components/Header.svelte';
	import { recipeCollectionsStore } from '../../../stores/recipeCollectionsStore';

	export let data;

	let recipes: Recipe[] = [];
	let collectionName: string;
	recipeCollectionsStore.subscribe((value) => {
		if (!(data.collectionId in value)) return;
		recipes = value[data.collectionId].recipes || [];
		collectionName = value[data.collectionId].name;
	});

	let user: User | null;
	currentUser.subscribe((value) => {
		user = value;
	});

	let loadingState: LoadingState;
	loadingStateStore.subscribe((value) => {
		loadingState = value;
	});

	let filterModal: HTMLDialogElement;
	let searchPattern: string = '';
	let filters: string[] = [];
	let recipesCount: number;

	function onFilterChange(checked: boolean, value: string) {
		if (!checked && filters.includes(value)) filters = filters.filter((x) => x !== value);
		else if (checked) filters = [...filters, value];
	}

	function filterRecipes(recipes: Recipe[], searchPattern: string, filters: string[]) {
		let filteredRecipes: Recipe[] = fullTextFilter(recipes, searchPattern) as Recipe[];
		filters.forEach((pattern) => {
			filteredRecipes = fullTextFilter(filteredRecipes, pattern) as Recipe[];
		});
		recipesCount = filteredRecipes.length;
		return filteredRecipes;
	}

	let page = 0;
	let pageSize = 6;
	function getRecipesFromPage(
		recipes: Recipe[],
		page: number,
		searchPattern: string,
		filters: string[]
	): Recipe[] {
		const filteredRecipes = filterRecipes(recipes, searchPattern, filters);

		const startIndex = page * pageSize;
		const endIndex = Math.min(startIndex + pageSize, filteredRecipes.length);

		return filteredRecipes.slice(startIndex, endIndex);
	}
</script>

<div class="flex gap-4 flex-col items-center">
	<Header
		backLink="/recipes"
		title={collectionName}
		loading={loadingState !== 'FINISHED'}
		sticky={true}
	/>

	<div class="w-full flex flex-col gap-2">
		<div class="join flex">
			<div class="w-3/5 relative bg-red-700">
				<input
					class="w-full input input-bordered join-item pl-8"
					placeholder="Search"
					bind:value={searchPattern}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="absolute left-2 top-4 h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="gray"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<button class="w-2/5 btn join-item" on:click={() => filterModal.showModal()}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
					/>
				</svg>
				Filter {filters.length > 0 ? `(${filters.length})` : ''}
			</button>
		</div>
		<div>
			{#each filters as filter}
				<button class="badge badge-neutral mx-1" on:click={() => onFilterChange(false, filter)}>
					{filter} x
				</button>
			{/each}
		</div>
		<div class="divider -my-2" />
	</div>

	<div class="grid grid-cols-fluid gap-6 w-full justify-center mt-4">
		{#if loadingState === 'LOADING'}
			<RecipeSkeleton />
			<RecipeSkeleton />
		{:else}
			{#each getRecipesFromPage(recipes, page, searchPattern, filters) as recipe}
				<RecipeCard {recipe} collectionId={data.collectionId} />
			{/each}
		{/if}
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
		href={`/recipe/create/${data.collectionId}`}
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

<dialog bind:this={filterModal} class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Filter</h3>

		<div class="flex flex-col gap-2">
			<div>
				<h4 class="text-md">Tags</h4>
				<div class="divider my-0" />
				<div>
					{#each new Set(recipes.flatMap((recipe) => recipe.tags || [])) as filterItem}
						<label class="swap mx-1">
							<input
								type="checkbox"
								checked={filters.includes(filterItem)}
								on:input={(e) => {
									// @ts-ignore
									onFilterChange(e.target?.checked, filterItem);
								}}
							/>
							<div class="swap-on"><div class="badge badge-neutral">{filterItem} x</div></div>
							<div class="swap-off"><div class="badge badge-outline">{filterItem}</div></div>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<div class="modal-action">
			<form class="w-full" method="dialog">
				<button class="btn btn-block">Anwenden ({recipesCount})</button>
			</form>
		</div>
	</div>
</dialog>
