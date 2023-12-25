import { database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollections, RecipeCollection } from '../../../models/RecipeCollections';
import { addCollectionToDatabase, getDefaultCollection } from './collection.handler';
import { v4 as uuidv4 } from 'uuid';

export async function GET({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		try {
			const data = await database.ref(`collections`).orderByChild('ownerId').equalTo(uid).get();
			let val: RecipeCollections = data.val() || {};
			Object.keys(val).forEach((collection: string) => {
				val[collection].recipes = Object.values(val[collection].recipes || {});
				val[collection].participants = Object.values(val[collection].participants ?? {});
			});

			if (Object.values(val).length < 1) {
				const collectionId = uuidv4();
				await addCollectionToDatabase('Hauptsammlung', uid, collectionId);
				val[collectionId] = await getDefaultCollection(uid, 'Hauptsammlung', collectionId);
			}

			return json(val);
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
