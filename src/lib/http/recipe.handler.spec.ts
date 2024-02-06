import { describe, it, expect, vi, beforeEach, type MockedFunction, beforeAll } from 'vitest';
import { addRecipeToCollection, deleteRecipeFromCollection } from './recipe.handler';
import { testUser } from '../dummyUser';
import axios from 'axios';
import type { Recipe } from '../../models/Recipe';
import * as alertHandler from '../../components/alerts/alert.handler';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
import type { RecipeCollections } from '../../models/RecipeCollections';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

describe('RecipeHandler', () => {
	let recipe: Recipe;
	let collections: RecipeCollections;

	vi.mock('axios');
	vi.mock('$app/navigation', () => {
		return {
			__esModule: true,
			goto: vi.fn().mockImplementation(() => Promise.resolve())
		};
	});

	beforeAll(() => {
		testUser.getIdToken = async () => 'token';
	});

	beforeEach(() => {
		vi.restoreAllMocks();

		recipe = {
			image: 'recipe-image.jpg',
			title: 'Title',
			tagline: 'A tasty dish',
			tags: ['tag1', 'tag2', 'tag3'],
			url: 'https://example.com/recipe',
			createdTime: '2022-01-01',
			updatedTime: '2022-01-02',
			difficulty: 'easy',
			ingredients: {},
			description: ['Step 1', 'Step 2', 'Step 3'],
			id: 'recipe-id',
			collectionId: '123',
			creatorId: 'creator-id'
		};

		collections = {
			'123': {
				ownerId: 'uid',
				name: 'Test Recipe Collection',
				id: '123',
				inviteCode: '12345',
				private: false,
				cover: 'https://www.test.com/test.jpg',
				recipes: [],
				participants: []
			}
		};
		recipeCollectionsStore.set(structuredClone(collections));
	});

	it('should create a post request to add the recipe', async () => {
		const postMock = axios.post as MockedFunction<typeof axios.post>;
		postMock.mockResolvedValue({ status: 200, data: recipe });

		const formData = new FormData();
		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection(testUser, formData, '123');

		expect(postMock).toHaveBeenCalledWith(`/api/collection/123/recipe`, {
			data: formData,
			headers: {
				Accept: 'application/json',
				Authorization: 'token'
			}
		});
	});

	it('should goto recipe on create if request is successful', async () => {
		const postMock = axios.post as MockedFunction<typeof axios.post>;
		postMock.mockResolvedValue({ status: 200, data: recipe });
		const gotoMock = goto as MockedFunction<typeof goto>;

		const formData = new FormData();
		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection(testUser, formData, '123');

		expect(gotoMock).toHaveBeenCalledWith(`/recipe/123/recipe-id`);
	});

	it('should not goto recipe on create if request failed', async () => {
		const postMock = axios.post as MockedFunction<typeof axios.post>;
		postMock.mockResolvedValue({ status: 403, data: recipe });
		const gotoMock = goto as MockedFunction<typeof goto>;

		const formData = new FormData();
		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection(testUser, formData, '123');

		expect(gotoMock).not.toHaveBeenCalled();
	});

	it('should add the recipe to the collections store when request is successful', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: recipe
		});

		const formData = new FormData();
		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection(testUser, formData, '123');

		collections['123'].recipes = [recipe];
		expect(get(recipeCollectionsStore)).toEqual(collections);
	});

	it('should not add the recipe to the collections store when recipe with same id already exists', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: recipe
		});

		collections['123'].recipes = [recipe];
		recipeCollectionsStore.set(structuredClone(collections));

		const formData = new FormData();
		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection(testUser, formData, '123');

		expect(get(recipeCollectionsStore)).toEqual(collections);
	});

	it('should not add the recipe to the collections store if collection id doesnt exist', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: recipe
		});

		const formData = new FormData();
		recipe.id = 'non existant id';
		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection(testUser, formData, 'non existant id');

		expect(get(recipeCollectionsStore)).toEqual(collections);
	});

	it('should create a success alert if request is successful', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: recipe
		});
		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		const formData = new FormData();
		formData.append('recipe', JSON.stringify(recipe));
		await addRecipeToCollection(testUser, formData, '123');
		expect(alertSpy).toHaveBeenCalledWith({
			message: 'Das Rezept wurde erfolgreich gespeichert!',
			type: 'success'
		});
	});

	it.each([[401], [500], [301], [400], [undefined]])(
		'should create a failed alert when creating recipe and error code is not 200 (%s)',
		async (errorCode) => {
			(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
				status: errorCode
			});
			const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

			const formData = new FormData();
			formData.append('recipe', JSON.stringify(recipe));
			await addRecipeToCollection(testUser, formData, '123');

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beim Hinzufügen vom Rezept ist ein Fehler aufgetreten!${errorMsg}`,
				type: 'error'
			});
		}
	);

	it('should create a delete request to remove the recipe', async () => {
		const deleteMock = axios.delete as MockedFunction<typeof axios.delete>;
		deleteMock.mockResolvedValue({ status: 200 });

		await deleteRecipeFromCollection(testUser, recipe);

		expect(deleteMock).toHaveBeenCalledWith(`/api/collection/123/recipe?id=recipe-id`, {
			headers: {
				Authorization: 'token'
			}
		});
	});

	it('should remove the recipe from the collections store when request is successful', async () => {
		(axios.delete as MockedFunction<typeof axios.delete>).mockResolvedValue({
			status: 200,
			data: recipe
		});

		collections['123'].recipes = [recipe];
		recipeCollectionsStore.set(structuredClone(collections));

		await deleteRecipeFromCollection(testUser, recipe);

		collections['123'].recipes = [];
		expect(get(recipeCollectionsStore)).toEqual(collections);
	});

	it('should goto recipes page on delete if request is successful', async () => {
		const deleteMock = axios.delete as MockedFunction<typeof axios.post>;
		deleteMock.mockResolvedValue({ status: 200, data: recipe });
		const gotoMock = goto as MockedFunction<typeof goto>;

		await deleteRecipeFromCollection(testUser, recipe);

		expect(gotoMock).toHaveBeenCalledWith(`/recipes/123`);
	});

	it('should not goto recipes page on delete if request failed', async () => {
		const deleteMock = axios.delete as MockedFunction<typeof axios.post>;
		deleteMock.mockResolvedValue({ status: 403, data: recipe });
		const gotoMock = goto as MockedFunction<typeof goto>;

		await deleteRecipeFromCollection(testUser, recipe);

		expect(gotoMock).not.toHaveBeenCalled();
	});

	it.each([[401], [500], [301], [400], [undefined]])(
		'should create a failed alert when deleting recipe and error code is not 200 (%s)',
		async (errorCode) => {
			(axios.delete as MockedFunction<typeof axios.delete>).mockResolvedValue({
				status: errorCode
			});
			const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

			await deleteRecipeFromCollection(testUser, recipe);

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beim Löschen vom Rezept ist ein Fehler aufgetreten!${errorMsg}`,
				type: 'error'
			});
		}
	);
});
