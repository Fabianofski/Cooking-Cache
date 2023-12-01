import { database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';

export async function GET({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		try {
			const collectionsRef = await database.ref(`users/${uid}/collections`).get();
			const collections: Set<string> = new Set<string>(collectionsRef.val() as string[]);

			const data = await database.ref(`users/${uid}/recipes`).get();
			let val = data.val() || {};
			Object.keys(val).forEach((collection: string) => {
				val[collection] = Object.values(val[collection]);
			});

			collections.add('Hauptsammlung');
			collections.forEach((collection) => {
				if (!(collection in val)) val[collection] = [];
			});
			return json(val);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
