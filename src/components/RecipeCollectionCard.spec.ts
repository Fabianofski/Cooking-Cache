import { beforeEach, describe, expect, it } from 'vitest';
import RecipeCollectionCard from './RecipeCollectionCard.svelte';
import { render, waitFor } from '@testing-library/svelte';
import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
import type { RecipeCollection } from '../models/RecipeCollections';
import type { Recipe } from '../models/Recipe';

describe('RecipeCollectionCard', () => {
	const recipe: Recipe = {
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

	const recipeCollection: RecipeCollection = {
		ownerId: '1234567890',
		name: 'Test Recipe Collection',
		id: '0987654321',
		inviteCode: '12345',
		private: false,
		cover: undefined,
		recipes: [recipe, recipe, recipe],
		participants: []
	};

	beforeEach(() => {
		recipeCollectionsStore.set({ [recipeCollection.id]: recipeCollection });
	});

	it('should have a link to recipes page of the collection', () => {
		const { getByTestId } = render(RecipeCollectionCard, { recipeCollection: recipeCollection });

		const link = getByTestId('collection-link');
		expect(link.getAttribute('href')).toBe(`/recipes/${recipeCollection.id}`);
	});
});
