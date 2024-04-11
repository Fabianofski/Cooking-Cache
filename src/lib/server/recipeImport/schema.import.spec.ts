import { describe, it, expect, vi } from 'vitest';
import { extractCheerioSchemaRecipe } from './schema.import';
import * as cheerio from 'cheerio';

describe('Schema Import', () => {
	it('should import the recipe from html page', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT30M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			title: 'Recipe Name',
			url: 'https://example.com/recipe',
			createdTime: '2021-01-01',
			updatedTime: '2021-01-01',
			difficulty: 'medium',
			ingredients: {
				Default: [
					{
						name: 'sugar',
						amount: 1,
						unit: 'cup'
					},
					{
						name: 'flour',
						amount: 2,
						unit: 'cups'
					}
				]
			},
			description: ['Mix all ingredients'],
			numberOfServings: 4,
			tags: ['tag1', 'tag2'],
			nutrition: {
				calories: 100,
				protein: 10,
				fat: 5,
				carbs: 20
			}
		});
	});

	it('should import the image when it is an array', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","image":["https://example.com/image1.jpg","https://example.com/image2.jpg"],"datePublished":"2021-01-01","prepTime":"PT30M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			image: 'https://example.com/image1.jpg'
		});
	});

	it('should import the image when it is a Cover-Object', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","image":[{"@type":"ImageObject","url":"https://example.com/image1.jpg"}],"datePublished":"2021-01-01","prepTime":"PT30M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			image: 'https://example.com/image1.jpg'
		});
	});

	it('should import the description when it is a string', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT30M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","description":"Mix all ingredients","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			description: ['Mix all ingredients']
		});
	});

	it('should import the description when they are in a list', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT30M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":["Mix all ingredients","Bake"],"recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			description: ['Mix all ingredients', 'Bake']
		});
	});

	it('should import the description when they are in a HowTo-Object', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT30M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":[{"@type":"HowToSection","text":"Mix all ingredients"}],"recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			description: ['Mix all ingredients']
		});
	});

	it('should import the totalTime if available', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT10M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			cookingTime: 90
		});
	});

	it('should import the cookTime + prepTime if totalTime not available', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT10M","cookTime":"PT1H","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			cookingTime: 70
		});
	});

	it('should import 0 if cookTime, prepTime and totalTime not available', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			cookingTime: 0
		});
	});

	it('should import 0 if cookTime, prepTime and totalTime have wrong format', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"10M","cookTime":"1H","totalTime":"1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			cookingTime: 0
		});
	});

	it('should import the keywords when they are a string', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT10M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			tags: ['tag1', 'tag2']
		});
	});

	it('should import the keywords when they are a list', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT10M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":["tag1", "tag2"],"nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			tags: ['tag1', 'tag2']
		});
	});

	it('should import no keywords if not available', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT10M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			tags: []
		});
	});

	it('should import no nutrition if not available', () => {
		const $ = cheerio.load(
			'<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","datePublished":"2021-01-01","prepTime":"PT10M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":["tag1", "tag2"]}</script>'
		);
		const recipe = extractCheerioSchemaRecipe($);
		expect(recipe).toMatchObject({
			nutrition: {
				calories: 0,
				protein: 0,
				fat: 0,
				carbs: 0
			}
		});
	});

	it('should throw if no recipe is found', () => {
		const $ = cheerio.load('<html></html>');
		expect(() => extractCheerioSchemaRecipe($)).toThrowError('No schema recipe found');
	});

    it('should set the date to today if no datePublished is available', () => {
        const $ = cheerio.load(
            '<script type="application/ld+json">{"@type":"Recipe","name":"Recipe Name","url":"https://example.com/recipe","prepTime":"PT30M","cookTime":"PT1H","totalTime":"PT1H30M","recipeIngredient":["1 cup sugar","2 cups flour"],"recipeInstructions":"Mix all ingredients","recipeYield":"4","keywords":"tag1, tag2","nutrition":{"calories":"100","proteinContent":"10","fatContent":"5","carbohydrateContent":"20"}}</script>'
        );
        const mockedDate = new Date('2021-01-01T00:00:00.000Z');
        vi.spyOn(global, 'Date').mockImplementation(() => mockedDate);
        const recipe = extractCheerioSchemaRecipe($);
        expect(recipe).toMatchObject({
            createdTime: mockedDate.toISOString(),
            updatedTime: mockedDate.toISOString()
        });
    });
});
