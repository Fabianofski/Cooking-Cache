import { auth, database } from '$lib/server/firebase.admin';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { RecipeCollection } from '../../../models/RecipeCollections';

export function generateRandomInviteCode() {
	let code = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 10; i++) {
		code += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return code;
}

const defaultCovers = [
	'default-covers/collections/stickers/japanese.png',
	'default-covers/collections/stickers/veggies.png',
	'default-covers/collections/stickers/breakfast.png',
	'default-covers/collections/stickers/japanese2.png',
	'default-covers/collections/stickers/bbq.png',
	'default-covers/collections/stickers/indian.png',
	'default-covers/collections/cartoon/japanese.png',
	'default-covers/collections/cartoon/breakfast.png',
	'default-covers/collections/cartoon/bbq.png',
	'default-covers/collections/cartoon/overview.png',
	'default-covers/collections/cartoon/indian.png',
	'default-covers/collections/realistic/japanese.png',
	'default-covers/collections/realistic/breakfast.png',
	'default-covers/collections/realistic/bbq.png',
	'default-covers/collections/realistic/overview.png',
	'default-covers/collections/realistic/indian.png'
];

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
