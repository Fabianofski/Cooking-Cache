import { describe, it, expect } from 'vitest';
import { fullTextFilter } from './filter';
import type { Recipe } from '../../../models/Recipe';

describe('filter', () => {
	const recipe: Recipe = {
		image: '',
		title: '',
		tags: [],
		ingredients: {
			Default: [
				{ amount: undefined, name: '', unit: '' },
				{ amount: undefined, name: '', unit: '' },
				{ amount: undefined, name: '', unit: '' },
				{ amount: undefined, name: '', unit: '' }
			]
		},
		url: '',
		createdTime: new Date().toISOString(),
		updatedTime: new Date().toISOString(),
		difficulty: 'medium',
		cookingTime: 0,
		numberOfServings: 4,
		description: ['step1', 'step2', 'step3', 'step4'],
		id: '',
		collectionId: '',
		creatorId: ''
	};

	it('should return an empty array when the recipes array is empty', () => {
		const recipes: Recipe[] = [];

		const searchPattern = 'test';
		const result = fullTextFilter(recipes, searchPattern);

		expect(result).toEqual([]);
	});

	it('should return all recipes when search pattern is empty', () => {
		const recipes = [recipe, recipe, recipe];

		const searchPattern = '';
		const result = fullTextFilter(recipes, searchPattern);

		expect(result).toEqual(recipes);
	});

	it('should return all recipes which contain the search pattern in the title', () => {
		const recipeWithTitle = structuredClone(recipe);
		recipeWithTitle.title = 'pre test post';
		const recipes = [recipe, recipe, recipeWithTitle];

		const searchPattern = 'test';
		const result = fullTextFilter(recipes, searchPattern);

		expect(result).toEqual([recipeWithTitle]);
	});

	it('should return all recipes which contain the search pattern in the description', () => {
		const recipeWithTitle = structuredClone(recipe);
		recipeWithTitle.description.push('pre test post');
		const recipes = [recipe, recipe, recipeWithTitle];

		const searchPattern = 'test';
		const result = fullTextFilter(recipes, searchPattern);

		expect(result).toEqual([recipeWithTitle]);
	});

	it('should return all recipes which contain the search pattern in the ingredients', () => {
		const recipeWithTitle = structuredClone(recipe);
		recipeWithTitle.ingredients.Default[0].name = 'pre test post';
		const recipes = [recipe, recipe, recipeWithTitle];

		const searchPattern = 'test';
		const result = fullTextFilter(recipes, searchPattern);

		expect(result).toEqual([recipeWithTitle]);
	});

	it('should return all recipes which contain the search pattern in the tags', () => {
		const recipeWithTitle = structuredClone(recipe);
		recipeWithTitle.tags?.push('test');
		const recipes = [recipe, recipe, recipeWithTitle];

		const searchPattern = 'test';
		const result = fullTextFilter(recipes, searchPattern);

		expect(result).toEqual([recipeWithTitle]);
	});

	it('should return all recipes which contain the search pattern in the creatorId', () => {
		const recipeWithTitle = structuredClone(recipe);
		recipeWithTitle.creatorId = 'test';
		const recipes = [recipe, recipe, recipeWithTitle];

		const searchPattern = 'test';
		const result = fullTextFilter(recipes, searchPattern);

		expect(result).toEqual([recipeWithTitle]);
	});
});
