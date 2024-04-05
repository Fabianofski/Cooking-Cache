import { auth, database } from '$lib/server/firebase.admin';
import type { Recipe } from '../../../models/Recipe.js';

export async function POST({ request }) {
	const token = request.headers.get('Authorization');
	const body = await request.json();

	const recipeId = body.recipeId;
	const collectionId = body.collectionId;
	const date = body.date;

	if (!token || !collectionId) return new Response('400 Bad Request', { status: 400 });

	try {
		if (token === null) throw new Error('No token provided');
		const { uid } = await auth.verifyIdToken(token);

		try {
			const data = await database.ref(`weeklyPlan/${uid}/${date}/recipes`).get();
			const recipes = Object.values(data.val() || {});
			recipes.push({ recipeId, collectionId });
			await database.ref(`weeklyPlan/${uid}/${date}/recipes`).set(recipes);
			return new Response('200 OK', { status: 200 });
		} catch (error) {
			console.error(error);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return new Response('401 Unauthorized', { status: 401 });
	}
}

export async function DELETE({ request, url }) {
	const token = request.headers.get('Authorization');
	const date = url.searchParams.get('date');
	const index = url.searchParams.get('index');
	if (!token || !index || !date) return new Response('400 Bad Request', { status: 400 });

	try {
		if (token === null) throw new Error('No token provided');
		const { uid } = await auth.verifyIdToken(token);

		try {
			const data = await database.ref(`weeklyPlan/${uid}/${date}/recipes`).get();

			const recipes: Recipe[] = Object.values(data.val());
			if (!recipes) return new Response('404 Not Found', { status: 404 });

			recipes.splice(parseInt(index), 1);

			await database.ref(`weeklyPlan/${uid}/${date}/recipes`).set(recipes);
			return new Response('200 OK', { status: 200 });
		} catch (error) {
			console.error(error);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return new Response('401 Unauthorized', { status: 401 });
	}
}
