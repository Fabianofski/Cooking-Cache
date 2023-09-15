import { firestore } from '$lib/firebase';
import { json } from '@sveltejs/kit';

export async function GET() {
	const cityRef = firestore.collection('12345').doc('YtAn4V4ErjOrs9Sf5hnm');
	const doc = await cityRef.get();
	if (!doc.exists) {
		return json('No such document!');
	} else {
		return json(doc.data());
	}
}
