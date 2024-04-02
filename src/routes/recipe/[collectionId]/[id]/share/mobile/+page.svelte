<script lang="ts">
	import { onMount } from "svelte";
	import RecipePage from "../../RecipePage.svelte";
	import type { Recipe } from "../../../../../../models/Recipe";
	import { getRecipeWithAccessToken } from "$lib/http/recipe.handler";

    export let data;
    let recipe: Recipe | undefined;

    onMount(async () => {
        if (!data.accessToken) return;
        recipe = await getRecipeWithAccessToken(data.collectionId, data.id, data.accessToken);
    });

</script>
<RecipePage recipe={recipe} />

