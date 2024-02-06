import { testUser } from '$lib/dummyUser';
import axios from 'axios';
import { get } from 'svelte/store';
import { vi, beforeAll, beforeEach, type MockedFunction, expect, describe, it } from 'vitest';
import type { RecipeCollection, RecipeCollections } from '../../models/RecipeCollections';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
import { createNewRecipeCollection } from './recipeCollection.handler';
import * as alertHandler from '../../components/alerts/alert.handler';

describe('Create Collection Handler', () => {
	let collection: RecipeCollection;

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

		collection = {
			ownerId: 'uid',
			name: 'Test Recipe Collection',
			id: '123',
			inviteCode: '12345',
			private: false,
			cover: 'https://www.test.com/test.jpg',
			recipes: [],
			participants: []
		};
		recipeCollectionsStore.set({});
	});

	it('should create a post request to create a new collection', async () => {
		const postMock = axios.post as MockedFunction<typeof axios.post>;
		postMock.mockResolvedValue({ status: 200, data: structuredClone(collection) });

		await createNewRecipeCollection(testUser, 'testName');

		expect(postMock).toHaveBeenCalledWith(`/api/collection?collectionName=testName`, {
			headers: {
				Accept: 'application/json',
				Authorization: 'token'
			}
		});
	});

	it('should add the collection to the collections store when request is successful', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: structuredClone(collection)
		});

		await createNewRecipeCollection(testUser, 'testName');

		let collections: RecipeCollections = {};
		collections['123'] = collection;
		expect(get(recipeCollectionsStore)).toEqual(collections);
	});

	it('should create failed alert if data is undefined when creating new collection', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: undefined
		});

		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		await createNewRecipeCollection(testUser, 'testName');

		expect(alertSpy).toHaveBeenCalledWith({
			message: `Beim Hinzufügen der Rezeptsammlung ist ein Fehler aufgetreten!`,
			type: 'error'
		});
	});

	it('should create a success alert when creating collection if request is successful', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: collection
		});
		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		await createNewRecipeCollection(testUser, 'testName');

		expect(alertSpy).toHaveBeenCalledWith({
			message: 'Die Rezeptsammlung wurde erfolgreich hinzugefügt!',
			type: 'success'
		});
	});

	it.each([[401], [500], [301], [400], [undefined]])(
		'should create a failed alert when creating collection and error code is not 200 (%s)',
		async (errorCode) => {
			(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
				status: errorCode,
				data: collection
			});
			const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

			await createNewRecipeCollection(testUser, 'testName');

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beim Hinzufügen der Rezeptsammlung ist ein Fehler aufgetreten!${errorMsg}`,
				type: 'error'
			});
		}
	);
});
