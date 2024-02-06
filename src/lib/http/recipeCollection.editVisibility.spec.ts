import { describe, it, expect, vi, beforeEach, type MockedFunction, beforeAll } from 'vitest';
import { testUser } from '../dummyUser';
import axios from 'axios';
import * as alertHandler from '../../components/alerts/alert.handler';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
import type { RecipeCollection } from '../../models/RecipeCollections';
import { toggleRecipeCollectionVisibility } from './recipeCollection.handler';
import { get } from 'svelte/store';

describe('Edit Collection Visibility Handler', () => {
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

	it('should create a patch request to edit collection visibility', async () => {
		const patchMock = axios.patch as MockedFunction<typeof axios.patch>;
		patchMock.mockResolvedValue({ status: 200 });

		await toggleRecipeCollectionVisibility(testUser, '123', true);

		expect(patchMock).toHaveBeenCalledWith(`/api/collection/123/visibility?private=true`, null, {
			headers: {
				Authorization: 'token'
			}
		});
	});

	// Toggling Visibility in store is not handled in toggleRecipeCollectionVisibility function
	// it('should edit the collection private state in collection store when request successful', async () => {
	// 	const patchMock = axios.patch as MockedFunction<typeof axios.patch>;
	// 	patchMock.mockResolvedValue({ status: 200 });

	// 	await toggleRecipeCollectionVisibility(testUser, '123', true);
	// 	expect(get(recipeCollectionsStore)['123']['private']).toEqual(true);

	// 	await toggleRecipeCollectionVisibility(testUser, '123', false);
	// 	expect(get(recipeCollectionsStore)['123']['private']).toEqual(false);
	// });

	// it('should not edit the collection private state in collection store when request failed', async () => {
	// 	const patchMock = axios.patch as MockedFunction<typeof axios.patch>;
	// 	patchMock.mockResolvedValue({ status: 304 });

	// 	await toggleRecipeCollectionVisibility(testUser, '123', true);
	// 	expect(get(recipeCollectionsStore)['123']['private']).toEqual(false);

	// 	collection.private = true;
	// 	recipeCollectionsStore.set({ '123': collection });

	// 	await toggleRecipeCollectionVisibility(testUser, '123', false);
	// 	expect(get(recipeCollectionsStore)['123']['private']).toEqual(true);
	// });

	it('should create a success alert when request is successful', async () => {
		(axios.patch as MockedFunction<typeof axios.patch>).mockResolvedValue({
			status: 200
		});
		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		await toggleRecipeCollectionVisibility(testUser, '123', true);

		expect(alertSpy).toHaveBeenCalledWith({
			message: 'Die Rezeptsammlung ist nun privat!',
			type: 'success'
		});

		await toggleRecipeCollectionVisibility(testUser, '123', false);

		expect(alertSpy).toHaveBeenCalledWith({
			message: 'Die Rezeptsammlung ist nun öffentlich!',
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

			await toggleRecipeCollectionVisibility(testUser, '123', true);

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beim Ändern der Sichtbarkeit ist ein Fehler aufgetreten!${errorMsg}`,
				type: 'error'
			});
		}
	);
});
