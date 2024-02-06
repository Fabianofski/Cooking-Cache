import { describe, it, expect, vi, beforeEach, type MockedFunction, beforeAll } from 'vitest';
import { testUser } from '../dummyUser';
import axios from 'axios';
import * as alertHandler from '../../components/alerts/alert.handler';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
import type { RecipeCollection, RecipeCollections } from '../../models/RecipeCollections';
import { editRecipeCollectionName } from './recipeCollection.handler';
import { get } from 'svelte/store';

describe('Edit Collection Name Handler', () => {
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
		recipeCollectionsStore.set({ '123': collection });
	});

	it('should create a patch request to edit collection name', async () => {
		const patchMock = axios.patch as MockedFunction<typeof axios.patch>;
		patchMock.mockResolvedValue({ status: 200, data: structuredClone(collection) });

		await editRecipeCollectionName(testUser, '123', 'newName');

		expect(patchMock).toHaveBeenCalledWith(`/api/collection/123/name?newCollectionName=newName`, {
			headers: {
				Authorization: 'token'
			}
		});
	});

	it('should edit the collection in the collections store when request is successful', async () => {
		(axios.patch as MockedFunction<typeof axios.patch>).mockResolvedValue({
			status: 200
		});

		await editRecipeCollectionName(testUser, '123', 'newName');

		expect(get(recipeCollectionsStore)['123']['name']).toEqual('newName');
	});

	it('should not edit the collection in the collections store when request failed', async () => {
		(axios.patch as MockedFunction<typeof axios.patch>).mockResolvedValue({
			status: 304
		});

		await editRecipeCollectionName(testUser, '123', 'newName');

		expect(get(recipeCollectionsStore)['123']['name']).not.toEqual('newName');
	});

	it('should create a success alert when request is successful', async () => {
		(axios.patch as MockedFunction<typeof axios.patch>).mockResolvedValue({
			status: 200
		});
		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		await editRecipeCollectionName(testUser, '123', 'newName');

		expect(alertSpy).toHaveBeenCalledWith({
			message: 'Der Name der Rezeptsammlung wurde erfolgreich geändert!',
			type: 'success'
		});
	});

	it.each([[401], [500], [301], [400], [undefined]])(
		'should create a failed alert when error code is not 200 (%s)',
		async (errorCode) => {
			(axios.patch as MockedFunction<typeof axios.patch>).mockResolvedValue({
				status: errorCode
			});
			const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

			await editRecipeCollectionName(testUser, '123', 'newName');

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beim Umbenennen der Rezeptsammlung ist ein Fehler aufgetreten!${errorMsg}`,
				type: 'error'
			});
		}
	);
});
