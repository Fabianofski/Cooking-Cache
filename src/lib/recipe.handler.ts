import { goto } from '$app/navigation';
import type { User } from 'firebase/auth';
import { createNewAlert } from '../components/alerts/alert.handler';
import type { Recipe } from '../models/Recipe';
import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';

async function addRecipeToCollection(user: User, formData: FormData, collectionId: string) {
	const token = await user.getIdToken();
	return fetch(`/api/collection/${collectionId}/recipe`, {
		method: 'POST',
		body: formData,
		headers: {
			Accept: 'application/json',
			Authorization: token
		}
	})
		.then(async (res: Response) => {
			if (res.status !== 200) return Promise.reject(res);

			const recipe = (await res.json()) as Recipe;
			recipeCollectionsStore.update((value) => {
				if (value[collectionId].recipes.find((x) => x.id === recipe.id)) return value;
				value[collectionId].recipes.push(recipe);
				return value;
			});
			createNewAlert({
				message: 'Das Rezept wurde erfolgreich hinzugefügt!',
				type: 'success'
			});
			goto(`/recipe/${recipe.collectionId}/${recipe.id}`);
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Hinzufügen vom Rezept ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

async function deleteRecipeFromCollection(user: User, recipe: Recipe) {
	const token = await user.getIdToken();
	return fetch(`/api/collection/${recipe.collectionId}/recipe?id=${recipe.id}`, {
		method: 'DELETE',
		headers: {
			Authorization: token
		}
	})
		.then(async (res) => {
			if (res.status !== 200) return Promise.reject(res);

			const link = `/recipes/${recipe?.collectionId}`;
			recipeCollectionsStore.update((value) => {
				if (recipe)
					value[recipe.collectionId].recipes = value[recipe.collectionId].recipes.filter(
						(x) => x.id !== recipe?.id
					);
				return value;
			});
			createNewAlert({
				message: 'Das Rezept wurde erfolgreich gelöscht!',
				type: 'success'
			});
			goto(link);
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Löschen vom Rezept ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

export { addRecipeToCollection, deleteRecipeFromCollection };
