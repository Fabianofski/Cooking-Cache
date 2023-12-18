import { database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import type { RecipeCollections } from '../../../models/RecipeCollections.js';

export async function GET({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		try {
			const data = await database.ref(`users/${uid}/collections`).get();
			let val: RecipeCollections = data.val() || {};
			Object.keys(val).forEach((collection: string) => {
				val[collection].recipes = Object.values(val[collection].recipes);
			});
			if (!Object.keys(val).includes('Hauptsammlung'))
				val['Hauptsammlung'] = {
					participants: [],
					ownerId: uid,
					recipes: []
				};

			return json(val);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
