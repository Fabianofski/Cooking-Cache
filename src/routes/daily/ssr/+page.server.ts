import { getDailyRecipe } from '../../api/daily/daily.handler';

export const prerender = false;

export async function load() {
	return {
		recipe: await getDailyRecipe()
	};
}
