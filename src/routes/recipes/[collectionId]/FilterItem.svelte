<script lang="ts">
	export let filterItem: string;
	export let displayText: string = filterItem;
	export let filterIcon: string | undefined = undefined;
	export let checked: boolean;
	export let onFilterChange: (checked: boolean, value: string) => void;
</script>

<label class="swap mx-1">
	<input
		type="checkbox"
		{checked}
		on:input={(e) => {
			// @ts-ignore
			onFilterChange(e.target?.checked, filterItem);
		}}
	/>
	<div class="swap-on">
		<div class="badge badge-neutral">
			{#if filterIcon}
				<img src={filterIcon} alt={displayText} class="mr-1 w-4 h-4" />
			{/if}
			{displayText}
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
	<div class="swap-off">
		<div class="badge badge-outline">
			{#if filterIcon}
				<img src={filterIcon} alt={displayText} class="mr-1 w-4 h-4" />
			{/if}
			{displayText}
		</div>
	</div>
</label>
