import { database } from '$lib/firebase.admin';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { Recipe } from '../../../models/Recipe.js';

export async function GET({ url }) {
	const id = url.searchParams.get('recipeId') || '';
	if (id === '') return new Response('Bad Request', { status: 400 });

	let ref = database.ref('recipes/' + id);
	const snapshot = await ref.get();
	const data = snapshot.val();
	return json(data);
}

export async function POST({ request }) {
	const formData = await request.formData();
	const recipe = JSON.parse(formData.get('recipe') as string) as Recipe;
	recipe.id = uuidv4();

	return json(recipe);
}
