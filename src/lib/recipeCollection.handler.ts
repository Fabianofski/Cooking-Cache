import { createNewAlert } from '../components/alerts/alert.handler';
import type { User } from 'firebase/auth';
import { goto } from '$app/navigation';
import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';

async function editRecipeCollectionName(user: User, collectionId: string, collectionName: string) {
	const token = await user.getIdToken();
	return fetch(`/api/collection/${collectionId}/name?newCollectionName=${collectionName}`, {
		method: 'PATCH',
		headers: {
			Authorization: token
		}
	})
		.then(async () => {
			recipeCollectionsStore.update((value) => {
				value[collectionId].name = collectionName;
				return value;
			});
			createNewAlert({
				message: 'Der Name der Rezeptsammlung wurde erfolgreich geändert!',
				type: 'success'
			});
		})
		.catch(() => {
			createNewAlert({
				message: 'Beim Umbenennen der Rezeptsammlung ist ein Fehler aufgetreten!',
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
	return fetch(`/api/collection/${collectionId}/cover`, {
		method: 'PATCH',
		headers: {
			Authorization: token
		},
		body: formData
	})
		.then(async (response) => {
			const photoURL = await response.json();
			recipeCollectionsStore.update((value) => {
				value[collectionId].cover = photoURL;
				return value;
			});
			createNewAlert({
				message: 'Das Cover der Rezeptsammlung wurde erfolgreich geändert!',
				type: 'success'
			});
		})
		.catch(() => {
			createNewAlert({
				message: 'Beim Ändern des Covers ist ein Fehler aufgetreten!',
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
	return fetch(`/api/collection/${collectionId}/visibility?private=${privateState}`, {
		method: 'PATCH',
		headers: {
			Authorization: token
		}
	})
		.then(() => {
			createNewAlert({
				message: `Die Rezeptsammlung ist nun ${privateState ? 'privat' : 'öffentlich'}!`,
				type: 'success'
			});
		})
		.catch(() => {
			recipeCollectionsStore.update((value) => {
				value[collectionId].private = !privateState;
				return value;
			});
			createNewAlert({
				message: 'Beim Ändern der Sichtbarkeit ist ein Fehler aufgetreten!',
				type: 'error'
			});
		});
}

async function leaveRecipeCollection(user: User, collectionId: string) {
	const token = await user.getIdToken();
	return fetch(`/api/collection/${collectionId}/leave`, {
		method: 'DELETE',
		headers: {
			Authorization: token
		}
	})
		.then(async () => {
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
		.catch(() => {
			createNewAlert({
				message: 'Beim Verlassen der Rezeptsammlung ist ein Fehler aufgetreten!',
				type: 'error'
			});
		});
}

async function deleteRecipeCollection(user: User, collectionId: string) {
	const token = await user.getIdToken();

	return fetch(`/api/collection?collectionId=${collectionId}`, {
		method: 'DELETE',
		headers: {
			Authorization: token
		}
	})
		.then(async () => {
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
		.catch(() => {
			createNewAlert({
				message: 'Beim Löschen der Rezeptsammlung ist ein Fehler aufgetreten!',
				type: 'error'
			});
		});
}
export {
	editRecipeCollectionName,
	editRecipeCollectionCoverImage as replaceRecipeCollectionCoverImage,
	toggleRecipeCollectionVisibility,
	leaveRecipeCollection,
	deleteRecipeCollection
};
