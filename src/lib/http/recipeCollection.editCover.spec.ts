import { describe, it, expect, vi, beforeEach, type MockedFunction, beforeAll } from 'vitest';
import { testUser } from '../dummyUser';
import axios from 'axios';
import * as alertHandler from '../../components/alerts/alert.handler';
import { recipeCollectionsStore } from '../../stores/recipeCollectionsStore';
import type { RecipeCollection } from '../../models/RecipeCollections';
import { editRecipeCollectionCoverImage } from './recipeCollection.handler';
import { get } from 'svelte/store';

describe('Edit Collection Cover Handler', () => {
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

	it('should create a patch request to edit collection cover', async () => {
		const patchMock = axios.patch as MockedFunction<typeof axios.patch>;
		patchMock.mockResolvedValue({ status: 200, data: 'photoUrl' });

		const file = new File([''], 'filename', { type: 'image/png' });
		await editRecipeCollectionCoverImage(testUser, '123', file);

		const formData = new FormData();
		formData.append('cover', file);
		expect(patchMock).toHaveBeenCalledWith(`/api/collection/123/cover`, {
			data: formData,
			headers: {
				Authorization: 'token',
				'Content-Type': 'multipart/form-data'
			}
		});
	});

	it('should edit the collection cover in collection store when request successful', async () => {
		const patchMock = axios.patch as MockedFunction<typeof axios.patch>;
		patchMock.mockResolvedValue({ status: 200, data: 'photoUrl' });

		const file = new File([''], 'filename', { type: 'image/png' });
		await editRecipeCollectionCoverImage(testUser, '123', file);

		expect(get(recipeCollectionsStore)['123']['cover']).toEqual('photoUrl');
	});

	it('should not edit the collection cover in collection store when request failed', async () => {
		const patchMock = axios.patch as MockedFunction<typeof axios.patch>;
		patchMock.mockResolvedValue({ status: 304, data: 'photoUrl' });

		const file = new File([''], 'filename', { type: 'image/png' });
		await editRecipeCollectionCoverImage(testUser, '123', file);

		expect(get(recipeCollectionsStore)['123']['cover']).not.toEqual('photoUrl');
	});

	it('should create a success alert when request is successful', async () => {
		(axios.patch as MockedFunction<typeof axios.patch>).mockResolvedValue({
			status: 200,
			data: 'photoUrl'
		});
		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		await editRecipeCollectionCoverImage(
			testUser,
			'123',
			new File([''], 'filename', { type: 'image/png' })
		);

		expect(alertSpy).toHaveBeenCalledWith({
			message: 'Das Cover der Rezeptsammlung wurde erfolgreich geändert!',
			type: 'success'
		});
	});

	it('should create a failed alert when file is not an image', async () => {
		(axios.patch as MockedFunction<typeof axios.patch>).mockResolvedValue({
			status: 200,
			data: 'photoUrl'
		});
		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		await editRecipeCollectionCoverImage(
			testUser,
			'123',
			new File([''], 'filename', { type: 'text/html' })
		);

		expect(alertSpy).toHaveBeenCalledWith({
			message: 'Das Cover der Rezeptsammlung muss eine Bilddatei sein!',
			type: 'error'
		});
	});

	it.each([[401], [500], [301], [400], [undefined]])(
		'should create a failed alert when error code is not 200 (%s)',
		async (errorCode) => {
			(axios.patch as MockedFunction<typeof axios.patch>).mockResolvedValue({
				status: errorCode,
				data: 'photoUrl'
			});
			const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

			await editRecipeCollectionCoverImage(
				testUser,
				'123',
				new File([''], 'filename', { type: 'image/png' })
			);

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beim Ändern des Covers ist ein Fehler aufgetreten!${errorMsg}`,
				type: 'error'
			});
		}
	);
});
