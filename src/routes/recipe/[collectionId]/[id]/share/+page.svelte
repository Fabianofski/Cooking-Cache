<script lang="ts">
	import RecipePage from '../RecipePage.svelte';
	export let data;
</script>

<RecipePage recipe={data.recipe} />
