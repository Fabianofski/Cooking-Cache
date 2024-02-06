import { describe, it, expect, vi, beforeEach, type MockedFunction, beforeAll } from 'vitest';
import { testUser } from '../dummyUser';
import axios from 'axios';
import * as alertHandler from '../../components/alerts/alert.handler';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
import type { RecipeCollection } from '../../models/RecipeCollections';
import { deleteRecipeCollection } from './recipeCollection.handler';
import { get } from 'svelte/store';

describe('Delete Collection Handler', () => {
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

	it('should create a delete request to delete collection', async () => {
		const deleteMock = axios.delete as MockedFunction<typeof axios.delete>;
		deleteMock.mockResolvedValue({ status: 200 });

		await deleteRecipeCollection(testUser, '123');

		expect(deleteMock).toHaveBeenCalledWith(`/api/collection?collectionId=123`, {
			headers: {
				Authorization: 'token'
			}
		});
	});

	it('should add the collection to the collections store when delete request is successful', async () => {
		(axios.delete as MockedFunction<typeof axios.delete>).mockResolvedValue({
			status: 200
		});

		await deleteRecipeCollection(testUser, '123');

		expect(get(recipeCollectionsStore)).toEqual({});
	});

	it('should create a success alert when deleting collection if request is successful', async () => {
		(axios.delete as MockedFunction<typeof axios.delete>).mockResolvedValue({
			status: 200,
			data: collection
		});
		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		await deleteRecipeCollection(testUser, '123');

		expect(alertSpy).toHaveBeenCalledWith({
			message: 'Die Rezeptsammlung wurde erfolgreich gelöscht!',
			type: 'success'
		});
	});

	it.each([[401], [500], [301], [400], [undefined]])(
		'should create a failed alert when deleting collection and error code is not 200 (%s)',
		async (errorCode) => {
			(axios.delete as MockedFunction<typeof axios.delete>).mockResolvedValue({
				status: errorCode,
				data: collection
			});
			const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

			await deleteRecipeCollection(testUser, '123');

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beim Löschen der Rezeptsammlung ist ein Fehler aufgetreten!${errorMsg}`,
				type: 'error'
			});
		}
	);
});
