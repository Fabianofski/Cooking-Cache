import { auth, database } from '$lib/firebase.admin';
import type { RecipeCollection } from '../../../models/RecipeCollections';

export async function getDefaultCollection(uid: string) {
	const user = await auth.getUser(uid);
	const defaultCollection: RecipeCollection = {
		participants: [
			{
				displayName: user.displayName,
				uid: user.uid,
				email: user.email,
				photoURL: user.photoURL
			}
		],
		ownerId: uid,
		recipes: []
	};
	return defaultCollection;
}

export async function addCollectionToDatabase(collectionName: string, uid: string) {
	try {
		const ref = database.ref(`users/${uid}/collections/${collectionName}`);
		await ref.set(await getDefaultCollection(uid));
		return new Response('200 Ok', { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response('500 Internal Server Error', { status: 500 });
	}
}
