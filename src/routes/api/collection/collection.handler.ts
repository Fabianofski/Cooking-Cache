import { auth, database } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollection } from '../../../models/RecipeCollections';
import { v4 as uuidv4 } from 'uuid';

export async function getDefaultCollection(
	userId: string,
	collectionName: string,
	collectionId: string
) {
	const user = await auth.getUser(userId);
	const defaultCollection: RecipeCollection = {
		participants: [
			{
				displayName: user.displayName,
				uid: user.uid,
				email: user.email,
				photoURL: user.photoURL
			}
		],
		ownerId: userId,
		recipes: [],
		name: collectionName,
		id: collectionId
	};
	return defaultCollection;
}

export async function addCollectionToDatabase(collectionName: string, uid: string, uuid?: string) {
	try {
		if (!uuid) uuid = uuidv4();
		const ref = database.ref(`users/${uid}/collections/${uuid}`);
		const collection = await getDefaultCollection(uid, collectionName, uuid);
		await ref.set(collection);
		return json(collection);
	} catch (err) {
		console.error(err);
		return new Response('500 Internal Server Error', { status: 500 });
	}
}
