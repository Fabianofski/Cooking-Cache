<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { RecipeCollection } from '../../../../models/RecipeCollections';
	import JoinPage from '../JoinPage.svelte';

	export let data;

	let loading = true;
	let recipeCollection: RecipeCollection | undefined;
	onMount(() => {
		fetch(`${PUBLIC_BASE_URL}/api/collection/join?i=${data.inviteCode}`)
			.then((res) => res.json())
			.then((res) => {
				recipeCollection = res;
				loading = false;
			});
	});
</script>

<JoinPage {recipeCollection} inviteCode={data.inviteCode} {loading} />
