<script lang="ts">
	import SmallRecipeCard from '../../components/SmallRecipeCard.svelte';
	import type { Recipe } from '../../models/Recipe';
	import type WeeklyPlan from '../../models/WeeklyPlan';
	import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
	import SelectRecipeModal from './SelectRecipeModal.svelte';

	let days = getDatesOfWeek();
	let selectedDay: string = '';
	let weeklyPlan: WeeklyPlan = {};

	function getDatesOfWeek() {
		const today = new Date();
		const day = today.getDay();
		const diff = today.getDate() - day + (day === 0 ? -6 : 1);
		const monday = new Date(today.setDate(diff));
		return Array.from({ length: 7 }, (_, i) => {
			const date = new Date(monday);
			date.setDate(date.getDate() + i);
			return date.toISOString();
		});
	}

	let selectRecipeModal: HTMLDialogElement;
	function openSelectRecipeModal(day: string) {
		selectedDay = day;
		selectRecipeModal.showModal();
	}

	function selectedHandler(recipe: Recipe) {
		if (!weeklyPlan[selectedDay]) weeklyPlan[selectedDay] = { recipes: [] };
		weeklyPlan[selectedDay].recipes.push({
			recipeId: recipe.id,
			collectionId: recipe.collectionId
		});
		weeklyPlan = { ...weeklyPlan };

		selectRecipeModal.close();
	}

	function getRecipe(recipeId: string, collectionId: string) {
		const recipes = $recipeCollectionsStore[collectionId].recipes;
		return recipes.find((recipe) => recipe.id === recipeId);
	}
</script>

<svelte:head>
	<title>Wochenplaner | Cooking Cache</title>
</svelte:head>

<div class="flex flex-col gap-4">
	{#each days as day}
		<div class="min-h-24">
			<h2 class="text-lg font-bold">
				{new Date(day).toLocaleDateString('de-DE', {
					weekday: 'long',
					day: 'numeric',
					month: 'numeric',
					year: 'numeric'
				})}
			</h2>
			<div class="grid grid-cols-fluid gap-4">
				<div class="flex flex-col gap-2">
					{#if weeklyPlan[day]}
						{#each weeklyPlan[day].recipes as meal}
							<SmallRecipeCard recipe={getRecipe(meal.recipeId, meal.collectionId)} />
						{/each}
					{/if}
					<button
						class="flex justify-center items-center bg-base-200 rounded-lg w-full h-12 shadow-md shadow-neutral/50"
						on:click={() => openSelectRecipeModal(day)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>

<SelectRecipeModal bind:modal={selectRecipeModal} {selectedHandler} />
