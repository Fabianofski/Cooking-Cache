import { describe, it, expect, beforeEach } from 'vitest';
import type { Recipe } from '../../../models/Recipe';
import { sorters } from './sort';

describe('sort', () => {
	const recipe: Recipe = {
		image: '',
		title: '',
		tags: [],
		ingredients: { Default: [{ amount: undefined, name: '', unit: '' }] },
		url: '',
		createdTime: new Date().toISOString(),
		updatedTime: new Date().toISOString(),
		difficulty: 'medium',
		numberOfServings: 4,
		description: [],
		id: '',
		collectionId: '',
		creatorId: ''
	};
	let recipeA: Recipe;
	let recipeB: Recipe;

	beforeEach(() => {
		recipeA = { ...recipe };
		recipeB = { ...recipe };
	});

	it('should return -1 when date of recipeA is before RecipeB', () => {
		recipeA.createdTime = new Date(2020, 1, 22).toISOString();
		recipeB.createdTime = new Date(2020, 1, 1).toISOString();

		const result = sorters.createdAt(recipeA, recipeB);
		expect(result).toBe(-1);
	});

	it('should return 0 when date of recipeA is same as RecipeB', () => {
		recipeA.createdTime = new Date(2020, 1, 1).toISOString();
		recipeB.createdTime = new Date(2020, 1, 1).toISOString();

		const result = sorters.createdAt(recipeA, recipeB);
		expect(result).toBe(0);
	});

	it('should return 1 when date of recipeA is after RecipeB', () => {
		recipeA.createdTime = new Date(2020, 1, 1).toISOString();
		recipeB.createdTime = new Date(2020, 1, 22).toISOString();

		const result = sorters.createdAt(recipeA, recipeB);
		expect(result).toBe(1);
	});

	it('should return -1 when title of recipeA is alphabetically before RecipeB', () => {
		recipeA.title = 'A';
		recipeB.title = 'B';

		const result = sorters.alphabetical(recipeA, recipeB);
		expect(result).toBe(-1);
	});

	it('should return 0 when title of recipeA is alphabetically same as RecipeB', () => {
		recipeA.title = 'A';
		recipeB.title = 'A';

		const result = sorters.alphabetical(recipeA, recipeB);
		expect(result).toBe(0);
	});

	it('should return 1 when title of recipeA is alphabetically after RecipeB', () => {
		recipeA.title = 'B';
		recipeB.title = 'A';

		const result = sorters.alphabetical(recipeA, recipeB);
		expect(result).toBe(1);
	});
});
