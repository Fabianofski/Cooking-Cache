<script lang="ts">
	import SmallRecipeCard from '../../components/SmallRecipeCard.svelte';
	import type { Recipe } from '../../models/Recipe';
	import type WeeklyPlan from '../../models/WeeklyPlan';
	import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
	import SelectRecipeModal from './SelectRecipeModal.svelte';

	let days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
	let selectedDay: string = '';
	let meals = ['Frühstück', 'Mittagessen', 'Abendessen', 'Snack'];
	let selectedMeal: string = '';
	let weeklyPlan: WeeklyPlan = {};

	let selectRecipeModal: HTMLDialogElement;
	function openSelectRecipeModal(day: string, meal: string) {
		selectedDay = day;
		selectedMeal = meal;
		selectRecipeModal.showModal();
	}

	function selectedHandler(recipe: Recipe) {
		if (!weeklyPlan[selectedDay]) weeklyPlan[selectedDay] = {};
		if (!weeklyPlan[selectedDay][selectedMeal])
			weeklyPlan[selectedDay][selectedMeal] = {
				recipeId: '',
				collectionId: ''
			};
		weeklyPlan[selectedDay][selectedMeal].recipeId = recipe.id;
		weeklyPlan[selectedDay][selectedMeal].collectionId = recipe.collectionId;

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
			<h2 class="text-lg font-bold">{day}</h2>
			<div class="grid grid-cols-fluid gap-4">
				{#each meals as meal}
					<div class="flex flex-col gap-2">
						<h3 class="text-md">{meal}</h3>
						{#if weeklyPlan[day] && weeklyPlan[day][meal]}
							<SmallRecipeCard
								recipe={getRecipe(
									weeklyPlan[day][meal].recipeId,
									weeklyPlan[day][meal].collectionId
								)}
							/>
						{:else}
							<button
								class="flex justify-center items-center bg-base-200 rounded-lg w-full h-12 shadow-md shadow-neutral/50"
								on:click={() => openSelectRecipeModal(day, meal)}
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
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<SelectRecipeModal bind:modal={selectRecipeModal} {selectedHandler} />
