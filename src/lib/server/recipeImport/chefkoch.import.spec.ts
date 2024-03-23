import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import axios from 'axios';
import { extractChefkochRecipe, extractChefkochRecipeFromData } from './chefkoch.import';
import type ChefkochRecipe from '../../../models/ChefkochRecipe';

describe('extractChefkochRecipe', () => {
	let chefkochRecipe: ChefkochRecipe;
	vi.mock('axios');

	beforeEach(() => {
		vi.restoreAllMocks();
		chefkochRecipe = {
			previewImageUrlTemplate: 'https://www.chefkoch.de/rezepte/12345',
			title: 'Test Recipe',
			siteUrl: 'https://www.chefkoch.de/rezepte/12345',
			createdAt: '2021-01-01',
			difficulty: 2,
			ingredientGroups: [
				{
					header: 'Test Ingredient Group 1',
					ingredients: [
						{
							name: 'Test Ingredient 1',
							amount: 100,
							unit: 'g'
						}
					]
				},
				{
					header: '',
					ingredients: [
						{
							name: 'Test Ingredient 2',
							amount: 200,
							unit: 'g'
						}
					]
				}
			],
			instructions: 'Test Instructions 1\nTest Instructions 2',
			totalTime: 10,
			cookingTime: 5,
			restingTime: 5,
			servings: 4,
			tags: ['Test Tag 1', 'Test Tag 2'],
			nutrition: {
				kCalories: 100,
				proteinContent: 10,
				fatContent: 5,
				carbohydrateContent: 20
			}
		};
	});

	it('should call the chefkoch API with the correct URL', async () => {
		const getMock = axios.get as MockedFunction<typeof axios.get>;
		getMock.mockResolvedValue({ status: 200, data: chefkochRecipe });

		await extractChefkochRecipe('https://www.chefkoch.de/rezepte/12345/rezept-titel.html');

		expect(getMock).toHaveBeenCalledWith('https://api.chefkoch.de/v2/recipes/12345');
	});

	it('should extract the recipe from a chefkoch.de recipe', async () => {
		const getMock = axios.get as MockedFunction<typeof axios.get>;
		getMock.mockResolvedValue({ status: 200, data: chefkochRecipe });

		const recipe = await extractChefkochRecipe(
			'https://www.chefkoch.de/rezepte/12345/rezept-titel.html'
		);

		expect(recipe).toMatchObject({
			image: 'https://www.chefkoch.de/rezepte/12345',
			title: 'Test Recipe',
			url: 'https://www.chefkoch.de/rezepte/12345',
			createdTime: '2021-01-01',
			updatedTime: '2021-01-01',
			difficulty: 'medium',
			ingredients: {
				'Test Ingredient Group 1': [
					{
						name: 'Test Ingredient 1',
						amount: 100,
						unit: 'g'
					}
				],
				Default: [
					{
						name: 'Test Ingredient 2',
						amount: 200,
						unit: 'g'
					}
				]
			},
			description: ['Test Instructions 1', 'Test Instructions 2'],
			id: '',
			collectionId: '',
			creatorId: '',
			cookingTime: 10,
			numberOfServings: 4,
			tags: ['Test Tag 1', 'Test Tag 2'],
			nutrition: {
				calories: 100,
				protein: 10,
				fat: 5,
				carbs: 20
			}
		});
	});

	it('should extract the recipe from a chefkochRecipe', () => {
		const recipe = extractChefkochRecipeFromData(chefkochRecipe);
		expect(recipe).toMatchObject({
			image: 'https://www.chefkoch.de/rezepte/12345',
			title: 'Test Recipe',
			url: 'https://www.chefkoch.de/rezepte/12345',
			createdTime: '2021-01-01',
			updatedTime: '2021-01-01',
			difficulty: 'medium',
			ingredients: {
				'Test Ingredient Group 1': [
					{
						name: 'Test Ingredient 1',
						amount: 100,
						unit: 'g'
					}
				],
				Default: [
					{
						name: 'Test Ingredient 2',
						amount: 200,
						unit: 'g'
					}
				]
			},
			description: ['Test Instructions 1', 'Test Instructions 2'],
			id: '',
			collectionId: '',
			creatorId: '',
			cookingTime: 10,
			numberOfServings: 4,
			tags: ['Test Tag 1', 'Test Tag 2'],
			nutrition: {
				calories: 100,
				protein: 10,
				fat: 5,
				carbs: 20
			}
		});
	});

	it.each([
		[1, 'easy'],
		[2, 'medium'],
		[3, 'hard'],
		[undefined, 'easy']
	])(`should return the correct difficulty for %d (%s)`, (difficultyLevel, difficulty) => {
		chefkochRecipe.difficulty = difficultyLevel;
		const recipe = extractChefkochRecipeFromData(chefkochRecipe);
		expect(recipe.difficulty).toBe(difficulty);
	});

	it('should fill nutrition values with 0 if they are not present', () => {
		delete chefkochRecipe.nutrition;
		const recipe = extractChefkochRecipeFromData(chefkochRecipe);
		expect(recipe.nutrition).toMatchObject({
			calories: 0,
			protein: 0,
			fat: 0,
			carbs: 0
		});
	});
});
