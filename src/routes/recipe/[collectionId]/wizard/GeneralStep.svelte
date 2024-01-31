<script lang="ts">
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
</script>

<div class="form-control w-full col-span-full">
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

<div class="form-control w-full">
	<label class="label" for="">
		<span class="label-text">Titel*</span>
	</label>
	<input
		type="text"
		placeholder="Cheeseburger1.."
		class="input input-bordered w-full"
		bind:value={recipe.title}
	/>
</div>

<div class="form-control w-full">
	<label class="label" for="">
		<span class="label-text">Tagline*</span>
	</label>
	<input
		type="text"
		placeholder="Da best in da west1.."
		class="input input-bordered w-full"
		bind:value={recipe.tagline}
	/>
</div>
