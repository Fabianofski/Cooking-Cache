import { json } from '@sveltejs/kit';
import { getDailyRecipe } from './daily.handler';

export async function GET() {
	try {
		return json(await getDailyRecipe());
	} catch (err) {
		console.error(err);
		return new Response('500 Internal Server Error', { status: 500 });
	}
}
