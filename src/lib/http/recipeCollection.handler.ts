import { goto } from '$app/navigation';
import { PUBLIC_BASE_URL } from '$env/static/public';
import axios, { type AxiosResponse } from 'axios';
import type { User } from 'firebase/auth';
import { createNewAlert } from '../../components/alerts/alert.handler';
import type { RecipeCollection, RecipeCollections } from '../../models/RecipeCollections';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';

async function createNewRecipeCollection(user: User, collectionName: string) {
	const token = await user.getIdToken();

	return axios
		.post(`${PUBLIC_BASE_URL}/api/collection?collectionName=${collectionName}`, {
			headers: {
				Accept: 'application/json',
				Authorization: token
			}
		})
		.then(async (res: AxiosResponse) => {
			if (res.status !== 200) return Promise.reject(res);

			const collection: RecipeCollection = res.data;
			if (!collection) return Promise.reject('No collection returned');
			recipeCollectionsStore.update((value) => {
				value[collection.id] = collection;
				return value;
			});

			createNewAlert({
				message: 'Die Rezeptsammlung wurde erfolgreich hinzugefügt!',
				type: 'success'
			});
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Hinzufügen der Rezeptsammlung ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

async function getUserRecipeCollections(user: User) {
	const token = await user.getIdToken();

	return axios
		.get(`${PUBLIC_BASE_URL}/api/collection`, {
			headers: {
				Accept: 'application/json',
				Authorization: token
			}
		})
		.then(async (res) => {
			if (res.status !== 200) return Promise.reject(res);
			const data: RecipeCollections = res.data;
			recipeCollectionsStore.set(data);
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Laden der Rezeptsammlungen ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

async function joinRecipeCollectionWithInviteCode(user: User, inviteCode: string) {
	const token = await user.getIdToken();

	return axios
		.post(`${PUBLIC_BASE_URL}/api/collection/join?i=${inviteCode}`, {
			headers: {
				Authorization: token
			}
		})
		.then(async (res) => {
			if (res.status !== 200) return Promise.reject(res);
			const data = res.data;
			const collection: RecipeCollection = data;
			recipeCollectionsStore.update((recipes) => {
				recipes[collection.id] = collection;
				return recipes;
			});
			goto(`/recipes/${collection.id}`);
			createNewAlert({
				type: 'success',
				message: `Du bist der Rezeptsammlung erfolgreich beigetreten!`
			});
		})
		.catch((error) => {
			createNewAlert({
				type: 'error',
				message:
					'Beitreten der Rezeptsammlung fehlgeschlagen!' +
					(error.status ? ` (Error ${error.status})` : '')
			});
		});
}

async function editRecipeCollectionName(user: User, collectionId: string, collectionName: string) {
	const token = await user.getIdToken();
	return axios({
		method: 'patch',
		url: `${PUBLIC_BASE_URL}/api/collection/${collectionId}/name?newCollectionName=${collectionName}`,
		headers: {
			Authorization: token
		}
	})
		.then(async (res) => {
			if (res.status !== 200) return Promise.reject(res);

			recipeCollectionsStore.update((value) => {
				value[collectionId].name = collectionName;
				return value;
			});
			createNewAlert({
				message: 'Der Name der Rezeptsammlung wurde erfolgreich geändert!',
				type: 'success'
			});
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Umbenennen der Rezeptsammlung ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

async function editRecipeCollectionCoverImage(user: User, collectionId: string, file: File) {
	if (file['type'].split('/')[0] !== 'image') {
		createNewAlert({
			message: `Das Cover der Rezeptsammlung muss eine Bilddatei sein!`,
			type: 'error'
		});
		return;
	}

	const token = await user.getIdToken();

	const formData = new FormData();
	formData.append('cover', file);
	return axios({
		method: 'patch',
		url: `${PUBLIC_BASE_URL}/api/collection/${collectionId}/cover`,
		headers: {
			Authorization: token,
			'Content-Type': 'multipart/form-data'
		},
		data: formData
	})
		.then(async (res) => {
			if (res.status !== 200) return Promise.reject(res);

			const photoURL = res.data;
			recipeCollectionsStore.update((value) => {
				value[collectionId].cover = photoURL;
				return value;
			});
			createNewAlert({
				message: 'Das Cover der Rezeptsammlung wurde erfolgreich geändert!',
				type: 'success'
			});
		})
		.catch((error) => {
			createNewAlert({
				message: 'Beim Ändern des Covers ist ein Fehler aufgetreten!' + error,
				type: 'error'
			});
		});
}

async function toggleRecipeCollectionVisibility(
	user: User,
	collectionId: string,
	privateState: boolean
) {
	const token = await user.getIdToken();
	return axios({
		method: 'patch',
		url: `${PUBLIC_BASE_URL}/api/collection/${collectionId}/visibility?private=${privateState}`,
		headers: {
			Authorization: token
		}
	})
		.then((res) => {
			if (res.status !== 200) return Promise.reject(res);

			createNewAlert({
				message: `Die Rezeptsammlung ist nun ${privateState ? 'privat' : 'öffentlich'}!`,
				type: 'success'
			});
		})
		.catch((error) => {
			recipeCollectionsStore.update((value) => {
				value[collectionId].private = !privateState;
				return value;
			});
			createNewAlert({
				message:
					'Beim Ändern der Sichtbarkeit ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

async function leaveRecipeCollection(user: User, collectionId: string) {
	const token = await user.getIdToken();
	return axios({
		method: 'delete',
		url: `${PUBLIC_BASE_URL}/api/collection/${collectionId}/leave`,
		headers: {
			Authorization: token
		}
	})
		.then(async (res) => {
			if (res.status !== 200) return Promise.reject(res);

			recipeCollectionsStore.update((value) => {
				delete value[collectionId];
				return value;
			});
			createNewAlert({
				message: 'Du hast die Rezeptsammlung erfolgreich verlassen!',
				type: 'success'
			});
			goto('/recipes');
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Verlassen der Rezeptsammlung ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}

async function deleteRecipeCollection(user: User, collectionId: string) {
	const token = await user.getIdToken();

	return axios({
		method: 'delete',
		url: `${PUBLIC_BASE_URL}/api/collection?collectionId=${collectionId}`,
		headers: {
			Authorization: token
		}
	})
		.then(async (res) => {
			if (res.status !== 200) return Promise.reject(res);

			recipeCollectionsStore.update((value) => {
				delete value[collectionId];
				return value;
			});
			createNewAlert({
				message: 'Die Rezeptsammlung wurde erfolgreich gelöscht!',
				type: 'success'
			});
			goto('/recipes');
		})
		.catch((error) => {
			createNewAlert({
				message:
					'Beim Löschen der Rezeptsammlung ist ein Fehler aufgetreten!' +
					(error.status ? ` (Error ${error.status})` : ''),
				type: 'error'
			});
		});
}
export {
	createNewRecipeCollection,
	deleteRecipeCollection,
	editRecipeCollectionCoverImage,
	editRecipeCollectionName,
	getUserRecipeCollections,
	joinRecipeCollectionWithInviteCode,
	leaveRecipeCollection,
	toggleRecipeCollectionVisibility
};
