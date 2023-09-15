import { database } from '$lib/firebase';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const id = url.searchParams.get('recipeId') || '';
	if (id === '') return new Response('Bad Request', { status: 400 });

	let ref = database.ref('recipes/' + id);
	const snapshot = await ref.get();
	const data = snapshot.val();
	return json(data);
}
