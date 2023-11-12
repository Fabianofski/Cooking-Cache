import { database, verifyIdToken } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';

export async function GET({ request }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);

		try {
			const data = await database.ref(`users/${uid}/recipes`).get();
			return json(data.val());
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
