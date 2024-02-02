import { beforeEach, describe, expect, it, test } from 'vitest';
import RecipeCollectionCard from './RecipeCollectionCard.svelte';
import { render } from '@testing-library/svelte';
import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
import type { Participant, RecipeCollection } from '../models/RecipeCollections';
import type { Recipe } from '../models/Recipe';
import { currentUser } from '../stores/store';
import { testUser } from '$lib/dummyUser';

describe('RecipeCollectionCard', () => {
	let recipe: Recipe;
	let otherUser: Participant;
	let recipeCollection: RecipeCollection;

	beforeEach(() => {
		recipe = {
			image: '',
			title: '',
			tagline: '',
			url: '',
			createdTime: '',
			updatedTime: '',
			difficulty: 'easy',
			ingredients: {},
			description: [],
			id: '',
			collectionId: '',
			creatorId: ''
		};

		otherUser = {
			uid: '1234567890',
			displayName: 'Other User',
			photoURL: 'https://www.test.com/test.jpg',
			email: 'test@test.com'
		};

		recipeCollection = {
			ownerId: otherUser.uid,
			name: 'Test Recipe Collection',
			id: '0987654321',
			inviteCode: '12345',
			private: false,
			cover: 'https://www.test.com/test.jpg',
			recipes: [recipe, recipe, recipe],
			participants: [
				{
					uid: testUser.uid,
					displayName: testUser.displayName,
					photoURL: testUser.photoURL,
					email: testUser.email
				},
				otherUser
			]
		};

		recipeCollectionsStore.set({ [recipeCollection.id]: recipeCollection });
		currentUser.set(testUser);
	});

	it('should have a link to recipes page of the collection', () => {
		const { getByTestId } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const link = getByTestId('collection-link');
		expect(link.getAttribute('href')).toBe(`/recipes/${recipeCollection.id}`);
	});

	it('should have the name of the collection', () => {
		const { getByText } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const name = getByText(recipeCollection.name);
		expect(name).not.toBeNull();
	});

	it('should show the correct number of recipes in the collection', () => {
		const { getByText } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const count = getByText(recipeCollection.recipes.length + ' Rezepte');
		expect(count).not.toBeNull();
	});

	it('should show the correct number of participants in paragraph', () => {
		const { getByTestId } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const count = getByTestId('participants');
		expect(count.textContent).toBe(recipeCollection.participants?.length.toString());
	});

	it('should show 1 participants in paragraph when participants undefined', () => {
		recipeCollection.participants = undefined;
		const { getByTestId } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const count = getByTestId('participants');
		expect(count.textContent).toBe('1');
	});

	it('should show the correct number of participants in tooltip', () => {
		const { getByTestId } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const count = getByTestId('participants-tooltip');
		expect(count.getAttribute('data-tip')).toBe(
			recipeCollection.participants?.length.toString() + ' Teilnehmer'
		);
	});

	it('should show 1 participants in tooltip when participants undefined', () => {
		recipeCollection.participants = undefined;
		const { getByTestId } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const count = getByTestId('participants-tooltip');
		expect(count.getAttribute('data-tip')).toBe('1 Teilnehmer');
	});

	it('should show the cover image if it exists', () => {
		const { getByTestId } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const cover = getByTestId('collection-cover');
		expect(cover.getAttribute('src')).toBe(recipeCollection.cover);
	});

	it('should show the default cover image if it does not exist', () => {
		recipeCollection.cover = undefined;
		const { getByTestId } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const cover = getByTestId('collection-cover');
		expect(cover.getAttribute('src')).toBe('/default-cover.jpg');
	});

	it('shouldnt have a link to edit page if the user is not the owner'),
		() => {
			const { queryByTestId } = render(RecipeCollectionCard, {
				recipeCollection: recipeCollection
			});

			const link = queryByTestId('edit-collection-link');
			expect(link).toBeNull();
		};

	it('shouldnt have a link to edit page if the user is null'),
		() => {
			currentUser.set(null);
			const { queryByTestId } = render(RecipeCollectionCard, {
				recipeCollection: recipeCollection
			});

			const link = queryByTestId('edit-collection-link');
			expect(link).toBeNull();
		};

	it('should have a link to edit page if the user is the owner'),
		() => {
			const { queryByTestId } = render(RecipeCollectionCard, {
				recipeCollection: recipeCollection
			});
			recipeCollection.ownerId = testUser.uid;

			const link = queryByTestId('edit-collection-link');
			expect(link).not.toBeNull();
		};

	it('should show the name of the owner with (Du) when current user is owner', () => {
		recipeCollection.ownerId = testUser.uid;
		const { queryByText } = render(RecipeCollectionCard, {
			recipeCollection: recipeCollection
		});
		const owner = queryByText(testUser.displayName! + ' (Du)');
		expect(owner).not.toBeNull();
	});

	it('should show the name of the owner without (Du) when current user is not owner', () => {
		recipeCollection.ownerId = otherUser.uid;
		const { queryByText } = render(RecipeCollectionCard, {
			recipeCollection: recipeCollection
		});
		const owner = queryByText(otherUser.displayName!);
		const du = queryByText(otherUser.displayName! + ' (Du)');
		expect(owner).not.toBeNull();
		expect(du).toBeNull();
	});
});
