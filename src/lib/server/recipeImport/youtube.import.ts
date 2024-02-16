import axios from 'axios';
import type { Recipe } from '../../../models/Recipe';
import { YOUTUBE_API_KEY } from '$env/static/private';
import { extractIngredientsFromText } from './ingredient.extractor';
import type Ingredient from '../../../models/Ingredient';

export async function extractYoutubeRecipe(url: string): Promise<Recipe> {
	const recipe: Recipe = {
		image: '',
		title: '',
		url: url,
		createdTime: '',
		updatedTime: '',
		difficulty: 'easy',
		ingredients: {},
		description: [],
		id: '',
		collectionId: '',
		creatorId: '',
		cookingTime: 20,
		numberOfServings: 4,
		tags: []
	};

	const id = url.split('/').pop()?.replace('watch?v=', '');

	const response = await axios.get(
		`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${YOUTUBE_API_KEY}`
	);

	if (response.data.items.length === 0) return recipe;
	const snippet = response.data.items[0].snippet;

	const description: string[] = snippet.description
		.split('\n')
		.filter((line: string) => line !== '');
	const ingredients: Ingredient[] = extractIngredientsFromText(snippet.description);

	recipe.title = snippet.title;
	recipe.image = snippet.thumbnails.high.url;
	recipe.description = description;
	recipe.ingredients = { Default: ingredients };
	recipe.createdTime = snippet.publishedAt;
	recipe.updatedTime = snippet.publishedAt;

	return recipe;
}
