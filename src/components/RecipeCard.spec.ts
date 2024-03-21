import { beforeEach, describe, expect, it } from 'vitest';
import RecipeCard from './RecipeCard.svelte';
import { render } from '@testing-library/svelte';
import type { Recipe } from '../models/Recipe';
import { testUser } from '$lib/dummyUser';
import type { Participant, RecipeCollection } from '../models/RecipeCollections';
import { recipeCollectionsStore } from '../stores/recipeCollectionsStore';
import { currentUser } from '../stores/store';

describe('RecipeCard', () => {
	let recipe: Recipe;
	let otherUser: Participant;
	let recipeCollection: RecipeCollection;

	beforeEach(() => {
		otherUser = {
			uid: '1234567890',
			displayName: 'Other User',
			photoURL: 'https://www.test.com/test.jpg',
			email: 'test@test.com'
		};

		recipe = {
			image: 'recipe-image.jpg',
			title: 'Title',
			tags: ['tag1', 'tag2', 'tag3'],
			url: 'https://example.com/recipe',
			createdTime: '2022-01-01',
			updatedTime: '2022-01-02',
			difficulty: 'easy',
			ingredients: {},
			description: ['Step 1', 'Step 2', 'Step 3'],
			id: 'recipe-id',
			collectionId: '0987654321',
			creatorId: 'creator-id',
			numberOfServings: 4,
			cookingTime: 20
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

	it('should have a link to recipes page of the recipe', () => {
		const { getByTestId } = render(RecipeCard, { recipe: recipe });

		const link = getByTestId('recipe-link');
		expect(link.getAttribute('href')).toBe(`/recipe/test-recipe-collection/title`);
	});

	it('should have the title of the recipe', () => {
		const { getByText } = render(RecipeCard, { recipe: recipe });

		const name = getByText(recipe.title);
		expect(name).not.toBeNull();
	});

	it('should have a default title when recipe title is empty', () => {
		recipe.title = '';
		const { getByText } = render(RecipeCard, { recipe: recipe });

		const name = getByText('Titel');
		expect(name).not.toBeNull();
	});

	it('should show the cover image if it exists', () => {
		const { getByTestId } = render(RecipeCard, { recipe: recipe });

		const cover = getByTestId('recipe-cover');
		expect(cover.getAttribute('src')).toBe(recipe.image);
	});

	it('should show the default cover image if it does not exist', () => {
		recipe.image = '';
		const { getByTestId } = render(RecipeCard, { recipe: recipe });

		const cover = getByTestId('recipe-cover');
		expect(cover.getAttribute('src')).toBe('/default-cover.jpg');
	});

	it('should show the name of the owner with (Du) when current user is owner', () => {
		recipe.creatorId = testUser.uid;
		const { getByText } = render(RecipeCard, { recipe: recipe });
		const owner = getByText(testUser.displayName! + ' (Du)');
		expect(owner).not.toBeNull();
	});

	it('should show the name of the owner without (Du) when current user is not owner', () => {
		recipe.creatorId = otherUser.uid;
		const { queryByText } = render(RecipeCard, { recipe: recipe });
		const owner = queryByText(otherUser.displayName!);
		const du = queryByText(otherUser.displayName! + ' (Du)');
		expect(owner).not.toBeNull();
		expect(du).toBeNull();
	});

	it('should show default name when owner has no displayname', () => {
		recipe.creatorId = otherUser.uid;
		otherUser.displayName = undefined;
		const { getByText } = render(RecipeCard, { recipe: recipe });
		const owner = getByText('Ersteller');
		expect(owner).not.toBeNull();
	});

	it.each([
		['easy', 'Leicht'],
		['medium', 'Mittel'],
		['hard', 'Schwer']
	])('should show the difficulty of recipe', (difficulty, localizedDifficulty) => {
		// @ts-ignore
		recipe.difficulty = difficulty;

		const { getByTestId } = render(RecipeCard, { recipe: recipe });

		const difficultyElement = getByTestId('difficulty');
		expect(difficultyElement.textContent?.trim()).toBe(localizedDifficulty);
	});

	it('should show the cooking time of recipe', () => {
		recipe.cookingTime = 60;
		const { getByTestId } = render(RecipeCard, { recipe: recipe });

		const cookingTime = getByTestId('cookingTime');
		expect(cookingTime.textContent?.trim()).toBe('60 Minuten');
	});
});
