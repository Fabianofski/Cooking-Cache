<script lang="ts">
	import type { Recipe } from '../../../../models/Recipe';
	import { onMount } from 'svelte';

	export let recipe: Recipe;

	onMount(() => {
		document.addEventListener('mouseup', onEndDrag);
		document.addEventListener('mousemove', onDrag);
		document.addEventListener('touchend', onEndDrag);
		document.addEventListener('touchmove', onDrag);
	});

	let draggable: HTMLDivElement | null = null;
	let draggedStep: HTMLDivElement | null = null;
	let currentHandlePosition: number | null = null;
	let dragOffset: number = 0;
	let bounds: { top: number; bottom: number } = { top: 0, bottom: 0 };
	function onStartDrag(handlePos: number, e: MouseEvent | TouchEvent) {
		let handleId = `drag-handle-${handlePos}`;
		draggable = document.getElementById(handleId) as HTMLDivElement;
		draggedStep = draggable.parentElement as HTMLDivElement;
		if (!draggedStep) return;

		currentHandlePosition = handlePos;

		const rect = draggedStep.getBoundingClientRect();
		const clientPos = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
		dragOffset = clientPos - rect.top;

		document.body.style.cursor = 'grabbing';
		document.body.style.userSelect = 'none';
		draggedStep.style.position = 'fixed';
		draggedStep.style.zIndex = '20';
		draggedStep.style.left = `${rect.left}px`;
		draggedStep.style.width = `${rect.width}px`;

		const stepList = document.getElementsByClassName('step-list')[0];
		bounds = {
			top: stepList.getBoundingClientRect().top || 0,
			bottom: stepList.getBoundingClientRect().bottom || 0
		};

		onDrag(e);
	}

	function onDrag(e: MouseEvent | TouchEvent) {
		if (!draggedStep) return;
		const mousePos = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - dragOffset;

		draggedStep.style.top = `${Math.max(bounds.top, Math.min(mousePos, bounds.bottom))}px`;

		const stepList = document.getElementsByClassName('step-list')[0];
		for (let i = 0; i < stepList.children.length; i++) {
			const element = stepList.children[i] as HTMLDivElement;

			if (!element.dataset.index || element === draggedStep) continue;

			const rect = element.getBoundingClientRect();

			if (mousePos <= rect.top) {
				currentHandlePosition = parseInt(element.dataset.index);
				break;
			}
		}
	}

	function onEndDrag() {
		if (!draggedStep || !draggable || currentHandlePosition === null) return;

		let oldIndex = parseInt(draggedStep.dataset.index || '');
		let description = recipe.description[oldIndex];
		recipe.description.splice(oldIndex, 1);

        if (oldIndex < currentHandlePosition) currentHandlePosition--;
		recipe.description.splice(currentHandlePosition, 0, description);
        recipe.description = [...recipe.description];

		document.body.style.cursor = 'auto';
		document.body.style.userSelect = 'auto';
		draggedStep.style.position = 'static';
		draggedStep.style.zIndex = 'auto';
		draggable = null;
		draggedStep = null;
		currentHandlePosition = null;
	}
</script>

<div class="form-control col-span-full">
	<label class="label" for="">
		<span class="label-text">Rezept Beschreibung*</span>
	</label>
	<div class="flex flex-col gap-2 step-list relative">
		{#each recipe.description as { }, index}
			{#if currentHandlePosition === index && draggedStep}
				<div class="w-full h-16"/>
			{/if}
			<div class="flex" data-index={index}>
				<div
					id={`drag-handle-${index}`}
					class="cursor-pointer text-slate-400"
					on:mousedown={(e) => {
						onStartDrag(index, e);
					}}
					on:touchstart={(e) => {
						onStartDrag(index, e);
					}}
					role="button"
					tabindex="0"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
					</svg>
				</div>
				<textarea
					class="input input-bordered h-16 w-full min-h-12 max-h-48"
					placeholder={`Schritt ${index + 1}`}
					bind:value={recipe.description[index]}
				/>
				<button
					class="btn btn-ghost btn-sm"
					on:click={() => {
						recipe.description.splice(index, 1);
						recipe.description = [...recipe.description];
					}}
					class:invisible={recipe.description.length === 1}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 32 32"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		{/each}
		<div data-index={recipe.description.length} />
		{#if currentHandlePosition === recipe.description.length && draggedStep}
			<div class="w-full h-16" />
		{/if}

		<button
			class="btn btn-neutral btn-sm w-52 ml-8"
			on:click={() => {
				recipe.description = [...recipe.description, ''];
			}}
		>
			+
		</button>
	</div>
</div>
