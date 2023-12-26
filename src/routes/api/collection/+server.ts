import { database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollections, RecipeCollection } from '../../../models/RecipeCollections';
import { addCollectionToDatabase, getDefaultCollection } from './collection.handler';
import { v4 as uuidv4 } from 'uuid';

async function getJoinedCollections(uid: string): Promise<RecipeCollections> {
	let collections: RecipeCollections = {};

	const joinedData = await database.ref(`users/${uid}/joinedCollectionsIds`).get();
	const joinedCollectionsIds = Object.keys(joinedData.val() || {});
	for (let id of joinedCollectionsIds) {
		const joinedCollectionData = await database.ref(`collections/${id}`).get();
		const joinedCollection: RecipeCollection = joinedCollectionData.val() || {};
		if (Object.values(joinedCollection.participants || {}).find((p) => p.uid === uid))
			collections = { ...collections, [id]: joinedCollection };
	}

	return collections;
}

export async function GET({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		try {
			const data = await database.ref(`collections`).orderByChild('ownerId').equalTo(uid).get();
			let collections: RecipeCollections = data.val() || {};
			let joinedCollections: RecipeCollections = await getJoinedCollections(uid);
			collections = { ...collections, ...joinedCollections };

			Object.keys(collections).forEach((collection: string) => {
				collections[collection].recipes = Object.values(collections[collection].recipes || {});
				collections[collection].participants = Object.values(
					collections[collection].participants ?? {}
				);
			});
			console.log(collections);

			if (Object.values(collections).length < 1) {
				const collectionId = uuidv4();
				await addCollectionToDatabase('Hauptsammlung', uid, collectionId);
				collections[collectionId] = await getDefaultCollection(uid, 'Hauptsammlung', collectionId);
			}

			return json(collections);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}

export async function POST({ request, url }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);
		const collectionName = url.searchParams.get('collectionName');

		if (!collectionName) return new Response('400 Bad Request', { status: 400 });
		let illegalCharacters = ['.', '#', '$', '[', ']'];
		for (let char of illegalCharacters) {
			if (collectionName.includes(char)) {
				return new Response(
					'400 Bad Request. ' + illegalCharacters.join(' ,' + ' are not allowed.'),
					{ status: 400 }
				);
			}
		}

		return addCollectionToDatabase(collectionName, uid);
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}

export async function PATCH({ request, url }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);
		const newCollectionName = url.searchParams.get('newCollectionName');
		const collectionId = url.searchParams.get('collectionId');

		if (!newCollectionName || !collectionId)
			return new Response('400 Bad Request', { status: 400 });

		const data = await database.ref(`collections/${collectionId}`).get();
		let val: RecipeCollection = data.val();

		if (!collectionId) return new Response('404 Not Found', { status: 404 });
		val.name = newCollectionName;

		await database.ref(`collections/${collectionId}`).set(val);

		return new Response('200 OK', { status: 200 });
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}

export async function DELETE({ request, url }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);
		const collectionId = url.searchParams.get('collectionId');

		const ref = database.ref(`collections/${collectionId}`);
		ref
			.remove()
			.then(() => {
				return new Response('200 OK', { status: 200 });
			})
			.catch((err) => {
				console.error(err);
				return new Response('500 Internal Server Error', { status: 500 });
			});
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
