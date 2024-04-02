<script lang="ts">
	import RecipePage from '../RecipePage.svelte';
	import SharePage from './SharePage.svelte';
	export let data;
</script>

<SharePage recipe={data.recipe} />
