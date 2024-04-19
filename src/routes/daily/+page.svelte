<script lang="ts">
	import RecipePage from '../recipe/[collectionId]/[id]/RecipePage.svelte';
	import { currentUser, dailyRecipeStore } from '../../stores/store';
	import Header from '../../components/Header.svelte';
	import SelectCollectionModal from '../SelectCollectionModal.svelte';
	import type { RecipeCollection } from '../../models/RecipeCollections';
	import { addRecipeToCollection } from '$lib/http/recipe.handler';

    let modal: HTMLDialogElement;
    function saveAsRecipe() {
       modal.showModal();
    }

    async function selectedCollection(collection: RecipeCollection) {
        modal.close();
        if(!$currentUser || !$dailyRecipeStore) return;

        const formData = new FormData();
        const recipe = $dailyRecipeStore;
        recipe.collectionId = collection.id;
        formData.append("recipe", JSON.stringify(recipe));
        await addRecipeToCollection($currentUser, formData, collection.id)
    }
</script>

<Header title="Tägliches Rezept 🍽️" backLink="/" options={
    [
    {
        title: "Rezept speichern",
        callback: saveAsRecipe,
        icon: "/bookmark.svg"
    }
    ]
}/>
<RecipePage recipe={$dailyRecipeStore ?? undefined} />
<SelectCollectionModal bind:modal selectedHandler={selectedCollection}/>
