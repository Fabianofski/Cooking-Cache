<script lang="ts">
	import Header from "../../../../../components/Header.svelte";
	import type { Recipe } from "../../../../../models/Recipe";
	import RecipePage from "../RecipePage.svelte";

    export let recipe: Recipe | undefined;
</script>

<svelte:head>
    <title>{recipe?.title} | Cooking Cache</title>
</svelte:head>

<Header backLink="/recipes" title={recipe?.title || ""} loading={!recipe}/>
<RecipePage recipe={recipe} />
