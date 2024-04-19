<script>
	import RecipePage from "../recipe/[collectionId]/[id]/RecipePage.svelte";
    import { dailyRecipeStore } from "../../stores/store";
	import Header from "../../components/Header.svelte";

</script>
<Header title="Tägliches Rezept 🍽️" backLink="/" />
<RecipePage recipe={$dailyRecipeStore} />
