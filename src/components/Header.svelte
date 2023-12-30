<script lang="ts">
	export let title: string;
	export let loading: boolean;
	export let backLink: string | undefined = undefined;
	export let sticky: boolean = false;
	export let options: { callback: () => void; title: string; icon: string | undefined }[] = [];

	let justFocussed = false;
	let dropdown: HTMLElement;
	function click() {
		if (!justFocussed) {
			dropdown.blur();
		} else justFocussed = false;
	}

	function focusIn() {
		justFocussed = true;
	}
</script>

<div class={`w-full bg-base-100 ${sticky ? 'sticky top-16 z-10' : ''}`}>
	<div class="w-full relative">
		{#if backLink}
			<a href={backLink} class="absolute top-1">
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

		{#if options.length !== 0}
			<div class="absolute top-1 right-0">
				<div class="dropdown dropdown-end">
					<div
						tabindex="-1"
						role="button"
						class="btn btn-ghost btn-xs"
						bind:this={dropdown}
						on:click={click}
						on:keydown={click}
						on:focus={focusIn}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
							/>
						</svg>
					</div>
					<ul
						tabindex="-1"
						class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
					>
						<ul class="py-2 shadow menu dropdown-content z-[1] bg-base-200 rounded w-52">
							{#each options as option}
								<button
									class="btn btn-ghost min-h-0 h-8 flex justify-start"
									on:click={option.callback}
								>
									{#if option.icon}<img
											class="h-5"
											src={option.icon}
											alt={option.title + 'Icon'}
										/>{/if}
									{option.title}
								</button>
							{/each}
						</ul>
					</ul>
				</div>
			</div>
		{/if}
	</div>
	<div class="divider my-0" />
</div>
