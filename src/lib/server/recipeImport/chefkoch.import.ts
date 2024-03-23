import axios from 'axios';
import type { Recipe } from '../../../models/Recipe';
import type ChefkochRecipe from '../../../models/ChefkochRecipe';
import type Ingredient from '../../../models/Ingredient';

export async function extractChefkochRecipe(url: string): Promise<Recipe> {
	const recipeId = url.split('/')[4];
	const response = await axios.get<ChefkochRecipe>(
		`https://api.chefkoch.de/v2/recipes/${recipeId}`
	);
	const chefkochRecipe: ChefkochRecipe = response.data;
	return extractChefkochRecipeFromData(chefkochRecipe);
}

export function extractChefkochRecipeFromData(chefkochRecipe: ChefkochRecipe): Recipe {
	const recipe: Recipe = {
		image: chefkochRecipe.previewImageUrlTemplate.replace('<format>', 'crop-360x240'),
		title: chefkochRecipe.title,
		url: chefkochRecipe.siteUrl,
		createdTime: chefkochRecipe.createdAt,
		updatedTime: chefkochRecipe.createdAt,
		difficulty: getDifficulty(chefkochRecipe.difficulty),
		ingredients: getIngredients(chefkochRecipe.ingredientGroups),
		description: chefkochRecipe.instructions.split(`\n`).filter((x) => x !== ''),
		id: '',
		collectionId: '',
		creatorId: '',
		cookingTime: chefkochRecipe.totalTime,
		numberOfServings: chefkochRecipe.servings,
		tags: chefkochRecipe.tags,
		nutrition: {
			calories: chefkochRecipe.nutrition?.kCalories || 0,
			protein: chefkochRecipe.nutrition?.proteinContent || 0,
			fat: chefkochRecipe.nutrition?.fatContent || 0,
			carbs: chefkochRecipe.nutrition?.carbohydrateContent || 0
		}
	};

	return recipe;
}

function getDifficulty(difficulty: number | undefined): 'easy' | 'medium' | 'hard' {
	switch (difficulty) {
		case 1:
			return 'easy';
		case 2:
			return 'medium';
		case 3:
			return 'hard';
		default:
			return 'easy';
	}
}

function getIngredients(ingredientGroups: ChefkochRecipe['ingredientGroups']): {
	[key: string]: Ingredient[];
} {
	const ingredients: { [key: string]: Ingredient[] } = {};

	ingredientGroups.forEach((group) => {
		if (group.header.trim() === '') group.header = 'Default';
		group.header = group.header.trim().replace(':', '');
		ingredients[group.header] = [];

		group.ingredients.forEach((ingredient) => {
			ingredients[group.header].push({
				name: ingredient.name,
				amount: ingredient.amount,
				unit: ingredient.unit
			});
		});
	});

	return ingredients;
}
