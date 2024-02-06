import { describe, it, expect, vi, beforeEach, type MockedFunction, beforeAll } from 'vitest';
import { testUser } from '../dummyUser';
import axios from 'axios';
import * as alertHandler from '../../components/alerts/alert.handler';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
import type { RecipeCollection } from '../../models/RecipeCollections';
import { getUserRecipeCollections } from './recipeCollection.handler';
import { get } from 'svelte/store';

describe('Get Collections Handler', () => {
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

	it('should create a get request to get user collections', async () => {
		const getMock = axios.get as MockedFunction<typeof axios.get>;
		getMock.mockResolvedValue({ status: 200, data: { '123': collection } });

		await getUserRecipeCollections(testUser);

		expect(getMock).toHaveBeenCalledWith(`/api/collection`, {
			headers: {
				Accept: 'application/json',
				Authorization: 'token'
			}
		});
	});

	it('should set the collections store when request is successful', async () => {
		(axios.get as MockedFunction<typeof axios.get>).mockResolvedValue({
			status: 200,
			data: { '123': collection }
		});

		await getUserRecipeCollections(testUser);

		expect(get(recipeCollectionsStore)).toEqual({ '123': collection });
	});

	it.each([[401], [500], [301], [400], [undefined]])(
		'should create a failed alert when getting collections and error code is not 200 (%s)',
		async (errorCode) => {
			(axios.get as MockedFunction<typeof axios.get>).mockResolvedValue({
				status: errorCode,
				data: { '123': collection }
			});
			const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

			await getUserRecipeCollections(testUser);

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beim Laden der Rezeptsammlungen ist ein Fehler aufgetreten!${errorMsg}`,
				type: 'error'
			});
		}
	);
});
