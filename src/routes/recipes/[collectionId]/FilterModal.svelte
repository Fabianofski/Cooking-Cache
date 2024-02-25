<script lang="ts">
	import type { Recipe } from "../../../models/Recipe";

    export let filters: string[] = [];
    export let recipes: Recipe[] = [];
    export let recipesCount: number = 0;
    export let filterModal: HTMLDialogElement;
    export let onFilterChange: (checked: boolean, value: string) => void;
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
						<label class="swap mx-1">
							<input
								type="checkbox"
								checked={filters.includes(filterItem)}
								on:input={(e) => {
									// @ts-ignore
									onFilterChange(e.target?.checked, filterItem);
								}}
							/>
							<div class="swap-on">
								<div class="badge badge-neutral">
									{filterItem}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="ml-1 w-4 h-4"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
										/>
									</svg>
								</div>
							</div>
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
