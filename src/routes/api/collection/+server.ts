import { database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollections } from '../../../models/RecipeCollections';
import { addCollectionToDatabase, getDefaultCollection } from './collection.handler';

export async function GET({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		try {
			const data = await database.ref(`users/${uid}/collections`).get();
			let val: RecipeCollections = data.val() || {};
			Object.keys(val).forEach((collection: string) => {
				val[collection].recipes = Object.values(val[collection].recipes || {});
				val[collection].participants = Object.values(val[collection].participants ?? {});
			});

			if (!('Hauptsammlung' in val)) {
				await addCollectionToDatabase('Hauptsammlung', uid);
				val['Hauptsammlung'] = await getDefaultCollection(uid);
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
