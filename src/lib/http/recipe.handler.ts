import { goto } from '$app/navigation';
import { PUBLIC_BASE_URL } from '$env/static/public';
import axios, { type AxiosResponse } from 'axios';
import type { User } from 'firebase/auth';
import { createNewAlert } from '../../components/alerts/alert.handler';
import type { Recipe } from '../../models/Recipe';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
import { generateShortCollectionId, generateShortRecipeId } from '$lib/id.handler';

async function addRecipeToCollection(user: User, formData: FormData, collectionId: string) {
	const token = await user.getIdToken();
	return axios
		.post(`${PUBLIC_BASE_URL}/api/collection/${collectionId}/recipe`, formData, {
			headers: {
				Accept: 'application/json',
				Authorization: token
			}
		})
		.then(async (res: AxiosResponse) => {
			if (res.status !== 200) return Promise.reject(res);

			const recipe = res.data as Recipe;
			recipeCollectionsStore.update((value) => {
				if (!value[collectionId]) return value;
                let oldRecipeIndex = value[collectionId].recipes.findIndex((x) => x.id === recipe.id);
                if (oldRecipeIndex !== -1) value[collectionId].recipes.push(recipe);
                else value[collectionId].recipes[oldRecipeIndex] = recipe;

				goto(
					`/recipe/${generateShortCollectionId(
						value[recipe.collectionId],
						value
					)}/${generateShortRecipeId(recipe, value[recipe.collectionId].recipes)}`
				);

				return value;
			});
			createNewAlert({
				message: 'Das Rezept wurde erfolgreich gespeichert!',
				type: 'success'
			});
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
	return axios
		.delete(`${PUBLIC_BASE_URL}/api/collection/${recipe.collectionId}/recipe?id=${recipe.id}`, {
			headers: {
				Authorization: token
			}
		})
		.then(async (res) => {
			if (res.status !== 200) return Promise.reject(res);

			recipeCollectionsStore.update((value) => {
				if (recipe)
					value[recipe.collectionId].recipes = value[recipe.collectionId].recipes.filter(
						(x) => x.id !== recipe?.id
					);
				goto(`/recipes/${generateShortCollectionId(value[recipe.collectionId], value)}`);
				return value;
			});
			createNewAlert({
				message: 'Das Rezept wurde erfolgreich gelöscht!',
				type: 'success'
			});
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

async function getRecipeWithAccessToken(
	collectionId: string,
	recipeId: string,
	accessToken: string
): Promise<Recipe | undefined> {
	return axios
		.get(
			`${PUBLIC_BASE_URL}/api/collection/${collectionId}/recipe?id=${recipeId}&key=${accessToken}`
		)
		.then((res) => {
			if (res.status !== 200) return Promise.reject(res);
			return res.data as Recipe;
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Laden vom Rezept ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
			return undefined;
		});
}

async function generateRecipeAccessToken(
	user: User,
	collectionId: string,
	recipeId: string
): Promise<string | undefined> {
	const token = await user.getIdToken();
	return axios
		.get(`${PUBLIC_BASE_URL}/api/collection/${collectionId}/recipe/token?id=${recipeId}`, {
			headers: {
				Authorization: token
			}
		})
		.then((res) => {
			if (res.status !== 200) return Promise.reject(res);
			return res.data as string;
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Teilen vom Rezept ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
			return undefined;
		});
}

async function getBringImportLink(
	url: string,
	quantity: number,
	requestedQuantity: number
): Promise<string | undefined> {
	return axios
		.get(`${PUBLIC_BASE_URL}/api/recipe/import/bring`, {
			params: {
				url,
				baseQuantity: quantity,
				requestedQuantity: requestedQuantity
			}
		})
		.then((res) => {
			if (res.status !== 200) return Promise.reject(res);
			return res.data;
		})
		.catch((error) => {
			console.error(error);
			return undefined;
		});
}

export {
	addRecipeToCollection,
	deleteRecipeFromCollection,
	getRecipeWithAccessToken,
	generateRecipeAccessToken,
	getBringImportLink
};
