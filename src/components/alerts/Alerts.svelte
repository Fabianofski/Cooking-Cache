<script lang="ts">
	import type AlertOptions from '../../models/AlertOptions';
	import Alert from './Alert.svelte';
	import { alertStore } from './alert.handler';

	let alerts: {
		[key: string]: AlertOptions;
	} = {};
	alertStore.subscribe((value) => {
		alerts = value;
	});
</script>

<div
	class="fixed w-full h-full z-50 flex flex-col items-center justify-start gap-1 pointer-events-none mt-20"
>
	{#each Object.values(alerts) as alert (alert)}
		<Alert alertOptions={alert} />
	{/each}
</div>
