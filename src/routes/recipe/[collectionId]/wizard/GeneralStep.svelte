<script lang="ts">
	import { Capacitor } from '@capacitor/core';
	import RecipeCard from '../../../../components/RecipeCard.svelte';
	import { createNewAlert } from '../../../../components/alerts/alert.handler';
	import type { Recipe } from '../../../../models/Recipe';
	import { onMount } from 'svelte';

	export let recipe: Recipe;

	export let files: FileList | null = null;
	let fileInput: HTMLInputElement;
	$: if (files) {
		if (!(files[0]['type'].split('/')[0] === 'image')) {
			createNewAlert({
				message: `Das Cover vom Rezept muss eine Bilddatei sein!`,
				type: 'error'
			});
			files = null;
			fileInput.value = '';
		} else recipe.image = URL.createObjectURL(files[0]);
	}

	let inputFocus: HTMLElement;
	onMount(() => {
		if (!Capacitor.isNativePlatform()) inputFocus.focus();
	});
</script>

<div class="col-span-full flex justify-center">
	<div class="w-[25rem] max-w-full">
		<h2 class="text-md font-bold mb-2">Vorschau:</h2>
		<RecipeCard {recipe} />
	</div>
</div>

<div class="form-control w-full">
	<label class="label" for="">
		<span class="label-text">Titel*</span>
	</label>
	<input
		bind:this={inputFocus}
		type="text"
		placeholder="Cheeseburger.."
		class="input input-bordered w-full"
		bind:value={recipe.title}
	/>
</div>

<div class="form-control w-full">
	<label class="label" for="">
		<span class="label-text">Cover</span>
	</label>
	<input
		accept="image/png, image/jpeg"
		bind:this={fileInput}
		bind:files
		type="file"
		class="file-input w-full"
	/>
</div>
