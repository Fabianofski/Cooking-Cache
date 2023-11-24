import { database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';

export async function GET({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		try {
			const data = await database.ref(`users/${uid}/recipes`).get();
			let val = data.val() || {};
			Object.keys(val).forEach((collection: string) => {
				val[collection] = Object.values(val[collection]);
			});

			if (!('Hauptsammlung' in val)) val['Hauptsammlung'] = [];
			return json(val);
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
