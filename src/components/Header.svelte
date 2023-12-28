<script lang="ts">
	export let title: string;
	export let loading: boolean;
	export let backLink: string | undefined = undefined;
	export let sticky: boolean = false;
</script>

<div class={`w-full bg-base-100 ${sticky ? 'sticky top-16 z-10' : ''}`}>
	<div class="w-full relative">
		{#if backLink}
			<a href={backLink} class="absolute top-1 l-0">
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
						d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
					/>
				</svg>
			</a>
		{/if}
		{#if loading}
			<div class="w-full flex justify-center">
				<div class="skeleton h-6 w-32" />
			</div>
		{:else}
			<h2 class="text-lg font-bold text-center">{title}</h2>
		{/if}
	</div>
	<div class="divider my-0" />
</div>
