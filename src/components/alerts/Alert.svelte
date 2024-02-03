<script lang="ts">
	import type AlertOptions from '../../models/AlertOptions';
	import { alertStore } from './alert.handler';

	export let alertOptions: AlertOptions;

	function removeAlert() {
		alertStore.update((value) => {
			delete value[alertOptions.id!];
			return value;
		});
	}
</script>

<div
	class={`alert alert-${alertOptions.type} flex animate-fade max-w-sm w-full pointer-events-auto cursor-pointer opacity-0`}
	style={`--lifetime: ${alertOptions.lifetime ?? 5}s`}
	on:click={removeAlert}
	on:keydown={removeAlert}
	role="button"
	tabindex="0"
	aria-label={`Alert ${alertOptions.id}`}
	data-testid="alert"
>
	{#if alertOptions.type === 'error'}
		<svg
			data-testid="error-icon"
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	{:else if alertOptions.type === 'info'}
		<svg
			data-testid="info-icon"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="stroke-current shrink-0 w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	{:else if alertOptions.type === 'warning'}
		<svg
			data-testid="warning-icon"
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
	{:else if alertOptions.type === 'success'}
		<svg
			data-testid="success-icon"
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	{/if}

	<span>{alertOptions.message}</span>
</div>
