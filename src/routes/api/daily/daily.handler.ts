import { database } from '$lib/server/firebase.admin';
import axios from 'axios';
import type MealDbRecipe from '../../../models/MealDbRecipe';
import type { Recipe } from '../../../models/Recipe';
import type Ingredient from '../../../models/Ingredient';
import translate from 'translate';

translate.engine = 'google';

async function getIngredients(
	mealDbRecipe: MealDbRecipe
): Promise<{ [key: string]: Ingredient[] }> {
	const obj = mealDbRecipe as any;

	const ingredients: Ingredient[] = [];
	for (let i = 1; i <= 20; i++) {
		let ingredient = obj['strIngredient' + i];
		let measure = obj['strMeasure' + i];

		if (!ingredient) break;
		ingredient = await translate(ingredient, 'de');
		if (measure) {
			measure = await translate(measure + ' ingrdient', 'de');
			measure = measure.replace('Zutat', '').trim();
		}

		const amount = measure.match(/(\d+(?:[,.]\d+)?)/g)?.[0] || '';
		measure = measure.replace(amount, '').trim();

		ingredients.push({
			name: ingredient,
			amount: parseFloat(amount.replace(',', '.')),
			unit: measure
		});
	}
	return { Default: ingredients };
}

async function convertMealDbRecipeToRecipe(mealDbRecipe: MealDbRecipe) {
	mealDbRecipe.strInstructions = await translate(mealDbRecipe.strInstructions, 'de');

	const recipe: Recipe = {
		image: mealDbRecipe.strMealThumb,
		title: await translate(mealDbRecipe.strMeal, 'de'),
		url: mealDbRecipe.strSource,
		tags: mealDbRecipe.strTags ? mealDbRecipe.strTags.split(',') : undefined,
		createdTime: new Date().toISOString(),
		updatedTime: new Date().toISOString(),
		numberOfServings: 4,
		cookingTime: 45,
		difficulty: 'medium',

		ingredients: await getIngredients(mealDbRecipe),
		description: mealDbRecipe.strInstructions.split('\r\n'),
		nutrition: undefined,

		id: '',
		collectionId: '',
		creatorId: '',
		accessToken: undefined
	};
	return recipe;
}

export async function getDailyRecipe() {
	let data = await database.ref('daily').get();
	let value = data.val();
	let mealId = value?.mealId;
	let mealDate = value?.mealDate;

	let mealDbRecipe: MealDbRecipe;

	let today = new Date().setHours(0, 0, 0, 0);
	let mealDateObj = new Date(mealDate).setHours(0, 0, 0, 0);
	if (!mealId || today !== mealDateObj) {
		const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/random.php`);
		const data: { meals: MealDbRecipe[] } = response.data;
		mealDbRecipe = data.meals[0];

		await database.ref('daily/mealId').set(mealDbRecipe.idMeal);
		await database.ref('daily/mealDate').set(new Date().toISOString());
	} else {
		const response = await axios.get(
			`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
		);
		const data: { meals: MealDbRecipe[] } = response.data;
		mealDbRecipe = data.meals[0];
	}
	return await convertMealDbRecipeToRecipe(mealDbRecipe);
}
