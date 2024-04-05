<script lang="ts">
	import Header from '../../components/Header.svelte';
	import SmallRecipeCard from '../../components/SmallRecipeCard.svelte';
	import type { Recipe } from '../../models/Recipe';
	import type WeeklyPlan from '../../models/WeeklyPlan';
	import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
	import SelectRecipeModal from './SelectRecipeModal.svelte';

	let offset = 0;
	let days = getDatesOfWeek();
	let selectedDay: string = '';
	let weeklyPlan: WeeklyPlan = {};

	function getDatesOfWeek() {
		const todayWithOffset = new Date();
		todayWithOffset.setDate(todayWithOffset.getDate() + offset * 7);
		const day = todayWithOffset.getDay();
		const diff = todayWithOffset.getDate() - day + (day === 0 ? -6 : 1);
		const monday = new Date(todayWithOffset.setDate(diff));
		return Array.from({ length: 7 }, (_, i) => {
			const date = new Date(monday);
			date.setDate(date.getDate() + i);
			date.setUTCHours(0, 0, 0, 0);
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

	function removeRecipeFromPlan(day: string, mealIndex: number) {
		weeklyPlan[day].recipes.splice(mealIndex, 1);
		weeklyPlan = { ...weeklyPlan };
	}

	function getRecipe(recipeId: string, collectionId: string) {
		const recipes = $recipeCollectionsStore[collectionId].recipes;
		return recipes.find((recipe) => recipe.id === recipeId);
	}
</script>

<svelte:head>
	<title>Wochenplaner | Cooking Cache</title>
</svelte:head>

<Header title="Wochenplaner" />

<div class="flex flex-col items-center gap-4">
	<div class="join">
		<button
			class="join-item btn"
			on:click={() => {
				offset--;
				days = getDatesOfWeek();
			}}
		>
			«
		</button>
		<button class="join-item btn">
			{new Date(days[0]).toLocaleDateString()} - {new Date(
				days[days.length - 1]
			).toLocaleDateString()}
		</button>
		<button
			class="join-item btn"
			on:click={() => {
				offset++;
				days = getDatesOfWeek();
			}}
		>
			»
		</button>
	</div>
	<div class="w-full">
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
							{#each weeklyPlan[day].recipes as meal, index}
								<div class="flex">
									<SmallRecipeCard recipe={getRecipe(meal.recipeId, meal.collectionId)} />
									<button class="btn h-full" on:click={() => removeRecipeFromPlan(day, index)}>
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
												d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
											/>
										</svg>
									</button>
								</div>
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
								class="w-4 h-4"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<SelectRecipeModal bind:modal={selectRecipeModal} {selectedHandler} />
