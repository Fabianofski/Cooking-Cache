<script lang="ts">
	import Header from '../../../components/Header.svelte';
	import RecipeCard from '../../../components/RecipeCard.svelte';
	import RecipeSkeleton from '../../../components/RecipeSkeleton.svelte';
	import type FilterBadge from '../../../models/Filter';
	import type { Recipe } from '../../../models/Recipe';
	import { recipeCollectionsStore } from '../../../stores/recipeCollectionsStore';
	import { currentUser, loadingStateStore, type LoadingState } from '../../../stores/store';
	import FilterItem from './FilterItem.svelte';
	import FilterModal from './FilterModal.svelte';
	import { fullTextFilter } from './filter';
	import { sorters } from './sort';

	export let data;

	let recipes: Recipe[] = [];
	let collectionName: string;
	recipeCollectionsStore.subscribe((value) => {
		if (!(data.collectionId in value)) return;
		recipes = value[data.collectionId].recipes || [];
		collectionName = value[data.collectionId].name;
	});

	let loadingState: LoadingState;
	loadingStateStore.subscribe((value) => {
		loadingState = value;
	});

	let filterModal: HTMLDialogElement;
	let searchPattern: string = '';
	let filters: FilterBadge[] = [];
	let recipesCount: number = 0;

	function onFilterChange(checked: boolean, value: FilterBadge) {
		if (!checked) filters = filters.filter((x) => x.filterValue !== value.filterValue);
		else if (checked) {
			value.checked = true;
			filters = [...filters, value];
		}
	}

	function filterRecipes(recipes: Recipe[], searchPattern: string, filters: FilterBadge[]) {
		let filteredRecipes: Recipe[] = fullTextFilter(recipes, searchPattern) as Recipe[];
		filters.forEach((filter) => {
			filteredRecipes = fullTextFilter(filteredRecipes, filter.filterValue) as Recipe[];
		});
		recipesCount = filteredRecipes.length;
		return filteredRecipes;
	}

	let page = 0;
	let pageSize = 6;
	let sorting: string = 'createdAt';
	let reverse: boolean = false;
	function getRecipesFromPage(
		recipes: Recipe[],
		page: number,
		searchPattern: string,
		filters: FilterBadge[],
		sorting: string,
		reverse: boolean
	): Recipe[] {
		const filteredRecipes = filterRecipes(recipes, searchPattern, filters);

		const startIndex = page * pageSize;
		const endIndex = Math.min(startIndex + pageSize, filteredRecipes.length);

		const sortedAndFilteredRecipes = filteredRecipes.toSorted(sorters[sorting]);
		if (reverse) sortedAndFilteredRecipes.reverse();

		return sortedAndFilteredRecipes.slice(startIndex, endIndex);
	}
</script>

<svelte:head>
	<title>{collectionName} | Cooking Cache</title>
</svelte:head>

<div class="flex-1 flex gap-4 flex-col items-center">
	<Header backLink="/recipes" title={collectionName} loading={loadingState !== 'FINISHED'} />

	<div class="w-full flex flex-col gap-2">
		<div class="join flex">
			<div class="w-3/5 relative">
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
		<div class="flex justify-between items-end">
			<div>
				{#each filters as filter (filter)}
					<FilterItem {filter} {onFilterChange} primary={true} />
				{/each}
			</div>
			<div class="flex justify-end items-center min-w-64">
				<label class="swap swap-rotate">
					<input type="checkbox" bind:checked={reverse} />

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="swap-on mt-1 w-5 h-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
						/>
					</svg>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="swap-off mt-1 w-5 h-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
						/>
					</svg>
				</label>
				<select class="select select-ghost select-sm w-full max-w-52" bind:value={sorting}>
					<option value="createdAt">Hinzugefügt am</option>
					<option value="alphabetical">Rezepttitel</option>
					<option value="author">Autor</option>
					<option value="cookingtime">Zubereitungszeit</option>
				</select>
			</div>
		</div>
		<div class="divider -my-2" />
	</div>

	<div class="w-full flex-1 flex flex-col gap-4 justify-between">
		<div class="grid grid-cols-fluid gap-6 w-full mt-4">
			{#if loadingState === 'LOADING'}
				<RecipeSkeleton />
				<RecipeSkeleton />
			{:else if recipes.length === 0}
				<p class="italic text-center col-span-full text-neutral-400 mt-12">
					In dieser Sammlung sind noch keine Rezepte vorhanden.
				</p>
			{:else}
				{#each getRecipesFromPage(recipes, page, searchPattern, filters, sorting, reverse) as recipe}
					<RecipeCard {recipe} />
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
</div>

<div class="fixed max-w-3xl w-full bottom-0 z-20">
	<a
		class="btn btn-circle btn-primary w-14 h-14 absolute bottom-[5.5rem] right-9"
		href={`/recipe/${data.collectionId}/create`}
		class:btn-disabled={$currentUser === null}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="26"
			viewBox="0 -960 960 960"
			width="26"
			fill="currentColor"
		>
			<path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
		</svg>
	</a>
</div>

<FilterModal {filters} {recipes} {recipesCount} bind:filterModal {onFilterChange} />
