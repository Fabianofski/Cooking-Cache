import axios from 'axios';
import type { Recipe } from '../../../models/Recipe';
import type SchemaRecipe from '../../../models/SchemaRecipe';
import * as cheerio from 'cheerio';
import { extractIngredientFromLines } from './ingredient.extractor';

/* c8 ignore start */
export async function extractSchemaRecipe(url: string): Promise<Recipe> {
	const response = await axios.get(url);
	const $ = cheerio.load(response.data);
	return extractCheerioSchemaRecipe($);
}
/* c8 ignore stop */

export function extractCheerioSchemaRecipe($: cheerio.CheerioAPI): Recipe {
	const script = $('script[type="application/ld+json"]');

	let schemaRecipe: SchemaRecipe | undefined = undefined;
	for (let element of script) {
		// @ts-ignore
		const data = JSON.parse(element.children[0].data);

		if (data['@type'] === 'Recipe') {
			schemaRecipe = data;
			break;
		}
	}
	if (!schemaRecipe) throw new Error('No schema recipe found');

	const recipe: Recipe = {
		image: extractImageFromSchema(schemaRecipe.image),
		title: schemaRecipe.name,
		url: schemaRecipe.url,
		createdTime: schemaRecipe.datePublished,
		updatedTime: schemaRecipe.datePublished,
		difficulty: 'medium',
		ingredients: { Default: extractIngredientFromLines(schemaRecipe.recipeIngredient) },
		description: extractDescriptionFromSchema(schemaRecipe.recipeInstructions),
		id: '',
		collectionId: '',
		creatorId: '',
		cookingTime: extractCookingTimeFromSchema(
			schemaRecipe.prepTime,
			schemaRecipe.cookTime,
			schemaRecipe.totalTime
		),
		numberOfServings: parseInt(schemaRecipe.recipeYield),
		tags: extractTagsFromSchema(schemaRecipe.keywords),
		nutrition: {
			calories: parseInt(schemaRecipe.nutrition?.calories) || 0,
			protein: parseInt(schemaRecipe.nutrition?.proteinContent) || 0,
			fat: parseInt(schemaRecipe.nutrition?.fatContent) || 0,
			carbs: parseInt(schemaRecipe.nutrition?.carbohydrateContent) || 0
		}
	};

	return recipe;
}

function extractImageFromSchema(schemaImage: any): string {
	if (typeof schemaImage === 'object') {
		if (typeof schemaImage[0] === 'object' && 'url' in schemaImage[0]) return schemaImage[0].url;
		else return schemaImage[0];
	} else {
		return schemaImage;
	}
}

function extractDescriptionFromSchema(schemaInstructions: any): string[] {
	if (typeof schemaInstructions === 'object') {
		if (schemaInstructions[0].text)
			return schemaInstructions.map((instruction: any) => instruction.text);
		else return schemaInstructions;
	} else {
		return schemaInstructions.split('\n').filter((line: string) => line !== '');
	}
}

function extractCookingTimeFromSchema(
	schemaPrepTime: string | undefined,
	schemaCookTime: string | undefined,
	schemaTotalTime: string | undefined
): number {
	const schemaPrepMinutes = convertSchemaTimeToMinutes(schemaPrepTime);
	const schemaCookMinutes = convertSchemaTimeToMinutes(schemaCookTime);

	if (schemaTotalTime) {
		return convertSchemaTimeToMinutes(schemaTotalTime);
	} else return schemaPrepMinutes + schemaCookMinutes;
}

function convertSchemaTimeToMinutes(time: string | undefined): number {
	if (!time) return 0;
	const match = time.match(/PT(\d+H)?(\d+M)?/);
	if (!match) return 0;
	const hours = match[1] ? parseInt(match[1]) : 0;
	const minutes = match[2] ? parseInt(match[2]) : 0;
	return hours * 60 + minutes;
}

function extractTagsFromSchema(schemaKeywords: any): string[] {
	if (!schemaKeywords) return [];
	if (typeof schemaKeywords === 'string') {
		return schemaKeywords.split(',').map((keyword: string) => keyword.trim());
	} else {
		return schemaKeywords;
	}
}
