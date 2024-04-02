<script lang="ts">
	import { onMount } from "svelte";
	import type { Recipe } from "../../../../../../models/Recipe";
	import { getRecipeWithAccessToken } from "$lib/http/recipe.handler";
	import SharePage from "../SharePage.svelte";

    export let data;
    let recipe: Recipe | undefined;

    onMount(async () => {
        if (!data.accessToken) return;
        recipe = await getRecipeWithAccessToken(data.collectionId, data.id, data.accessToken);
    });

</script>
<SharePage recipe={recipe} />

