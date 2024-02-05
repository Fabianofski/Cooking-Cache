import { describe, it, expect, vi, beforeEach, type MockedFunction, beforeAll } from 'vitest';
import { testUser } from './dummyUser';
import axios from 'axios';
import * as alertHandler from '../components/alerts/alert.handler';
import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
import type { RecipeCollection, RecipeCollections } from '../models/RecipeCollections';
import {
	createNewRecipeCollection,
	getUserRecipeCollections,
	joinRecipeCollectionWithInviteCode
} from './recipeCollection.handler';
import { get } from 'svelte/store';

describe('RecipeCollectionHandler', () => {
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

	it('should create a post request to join collection', async () => {
		const postMock = axios.post as MockedFunction<typeof axios.post>;
		postMock.mockResolvedValue({ status: 200, data: structuredClone(collection) });

		await joinRecipeCollectionWithInviteCode(testUser, 'inviteCode');

		expect(postMock).toHaveBeenCalledWith(`/api/collection/join?i=inviteCode`, {
			headers: {
				Authorization: 'token'
			}
		});
	});

	it('should add the collection to the collections store when join request is successful', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: structuredClone(collection)
		});

		await joinRecipeCollectionWithInviteCode(testUser, 'inviteCode');

		let collections: RecipeCollections = {};
		collections['123'] = collection;
		expect(get(recipeCollectionsStore)).toEqual(collections);
	});

	it('should create failed alert if data is undefined when joining collection', async () => {
		(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
			status: 200,
			data: undefined
		});

		const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

		await joinRecipeCollectionWithInviteCode(testUser, 'inviteCode');

		expect(alertSpy).toHaveBeenCalledWith({
			message: `Beitreten der Rezeptsammlung fehlgeschlagen!`,
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
		'should create a failed alert when joining collection and error code is not 200 (%s)',
		async (errorCode) => {
			(axios.post as MockedFunction<typeof axios.post>).mockResolvedValue({
				status: errorCode,
				data: collection
			});
			const alertSpy = vi.spyOn(alertHandler, 'createNewAlert');

			await joinRecipeCollectionWithInviteCode(testUser, 'inviteCode');

			const errorMsg = errorCode ? ` (Error ${errorCode})` : '';
			expect(alertSpy).toHaveBeenCalledWith({
				message: `Beitreten der Rezeptsammlung fehlgeschlagen!${errorMsg}`,
				type: 'error'
			});
		}
	);
});
