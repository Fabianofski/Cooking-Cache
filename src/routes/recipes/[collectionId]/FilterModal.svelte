<script lang="ts">
	import type FilterBadge from '../../../models/Filter';
	import type { Recipe } from '../../../models/Recipe';
	import type { Participant } from '../../../models/RecipeCollections';
	import { recipeCollectionsStore } from '../../../stores/recipeCollectionsStore';
	import FilterItem from './FilterItem.svelte';

	export let filters: FilterBadge[] = [];
	export let recipes: Recipe[] = [];
	export let recipesCount: number = 0;
	export let filterModal: HTMLDialogElement;
	export let onFilterChange: (checked: boolean, value: FilterBadge) => void;

	function getDisplayNameByUid(uid: string) {
		return $recipeCollectionsStore[recipes[0].collectionId].participants?.find(
			(participant: Participant) => participant.uid === uid
		)?.displayName;
	}

	function getPhotoURLByUid(uid: string) {
		return $recipeCollectionsStore[recipes[0].collectionId].participants?.find(
			(participant: Participant) => participant.uid === uid
		)?.photoURL;
	}
</script>

<dialog bind:this={filterModal} class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Filter</h3>

		<div class="flex flex-col gap-2">
			<div>
				<h4 class="text-md">Tags</h4>
				<div class="divider my-0" />
				<div>
					{#each new Set(recipes.flatMap((recipe) => recipe.tags || [])) as filterItem}
						<FilterItem 
                            filter={{
                                displayText: filterItem,
                                checked: filters.find((filter) => filter.filterValue === filterItem)?.checked || false,
                                filterValue: filterItem
                            }}  
                            {onFilterChange} 
                        />
					{/each}
				</div>
			</div>
			<div>
				<h4 class="text-md">Autoren</h4>
				<div class="divider my-0" />
				<div>
					{#each new Set(recipes.flatMap((recipe) => recipe.creatorId || [])) as uid}
						<FilterItem
                            filter={{
                                displayText: getDisplayNameByUid(uid) || '',
                                checked: filters.find((filter) => filter.filterValue === uid)?.checked || false,
                                filterValue: uid,
                                icon: getPhotoURLByUid(uid) || undefined
                            }}
							{onFilterChange}
						/>
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
