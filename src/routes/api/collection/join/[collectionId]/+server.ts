import { database } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';

export async function GET({ url, params }) {
	let inviteCode = url.searchParams.get('i');
	let ownerId = url.searchParams.get('uid');
	let collectionId = params.collectionId;

	console.log(inviteCode, ownerId, collectionId);

	if (!inviteCode || !collectionId) return new Response('400 Bad Request', { status: 400 });

	const data = await database.ref(`users/${ownerId}/collections/${collectionId}`).get();
	let val = data.val();

	if (!val) return new Response('404 Not Found', { status: 404 });
	if (val.inviteCode !== inviteCode) return new Response('403 Forbidden', { status: 403 });

	return json(val);
}
