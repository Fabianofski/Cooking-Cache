<script lang="ts">
    import type FilterBadge from "../../../models/Filter";

	export let filter: FilterBadge; 
	export let onFilterChange: (checked: boolean, value: FilterBadge) => void;
    export let primary: boolean = false;

    const maxLength = 15;
</script>

<label class="swap mx-1">
	<input
		type="checkbox"
		checked={filter.checked}
		on:input={(e) => {
			// @ts-ignore
			onFilterChange(e.target?.checked, filter);
		}}
	/>
	<div class="swap-on flex items-center">
		<div class="badge" class:badge-primary={primary} class:badge-neutral={!primary}>
			{#if filter.icon}
				<img src={filter.icon} alt={filter.displayText} class="mr-1 h-full rounded-full" />
			{/if}
			{filter.displayText.slice(0, maxLength)}{filter.displayText.length > maxLength ? '...' : ''}
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
	<div class="swap-off flex items-center">
		<div class="badge badge-outline" class:badge-primary={primary}>
			{#if filter.icon}
				<img src={filter.icon} alt={filter.displayText} class="mr-1 h-full rounded-full" />
			{/if}
			{filter.displayText.slice(0, maxLength)}{filter.displayText.length > maxLength ? '...' : ''}
		</div>
	</div>
</label>
