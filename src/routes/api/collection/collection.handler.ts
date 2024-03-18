import { auth, database } from '$lib/server/firebase.admin';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { RecipeCollection, RecipeCollections } from '../../../models/RecipeCollections';
import { defaultCovers } from '$lib/defaultCollectionCovers';

export function generateRandomInviteCode() {
	let code = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 10; i++) {
		code += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return code;
}

export async function getRecipeCollectionByInviteCode(
	inviteCode: string
): Promise<RecipeCollection> {
	const data = await database
		.ref(`collections`)
		.orderByChild('inviteCode')
		.equalTo(inviteCode)
		.get();
	let snapshot = (data.val() || {}) as RecipeCollections;
	let collection: RecipeCollection | undefined = Object.values(snapshot).at(0);
	if (!collection) throw new Error('404 Not Found');

	if (collection.private) throw new Error('403 Forbidden');

	collection.recipes = Object.values(collection.recipes || {});

	return collection;
}

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
		id: collectionId,
		inviteCode: generateRandomInviteCode(),
		private: false,
		cover: defaultCovers[Math.floor(Math.random() * defaultCovers.length)]
	};
	return defaultCollection;
}

export async function addCollectionToDatabase(collectionName: string, uid: string, uuid?: string) {
	try {
		if (!uuid) uuid = uuidv4();
		const ref = database.ref(`collections/${uuid}`);
		const collection = await getDefaultCollection(uid, collectionName, uuid);
		await ref.set(collection);
		return json(collection);
	} catch (err) {
		console.error(err);
		return new Response('500 Internal Server Error', { status: 500 });
	}
}
