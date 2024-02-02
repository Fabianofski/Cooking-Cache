import { beforeEach, describe, expect, it } from 'vitest';
import RecipeCard from './RecipeCard.svelte';
import { render } from '@testing-library/svelte';
import type { Recipe } from '../models/Recipe';

describe('RecipeCard', () => {
	let recipe: Recipe;

	beforeEach(() => {
		recipe = {
			image: 'recipe-image.jpg',
			title: 'Title',
			tagline: 'A tasty dish',
			tags: ['tag1', 'tag2', 'tag3'],
			url: 'https://example.com/recipe',
			createdTime: '2022-01-01',
			updatedTime: '2022-01-02',
			difficulty: 'easy',
			ingredients: {},
			description: ['Step 1', 'Step 2', 'Step 3'],
			id: 'recipe-id',
			collectionId: 'collection-id',
			creatorId: 'creator-id'
		};
	});

	it('should render info when recipe is null', () => {
		const { queryByText } = render(RecipeCard, { recipe: null });
		expect(queryByText('Kein Rezept gefunden!')).not.toBeNull();
	});

	it('should have a link to recipes page of the recipe', () => {
		const { getByTestId } = render(RecipeCard, { recipe: recipe });

		const link = getByTestId('recipe-link');
		expect(link.getAttribute('href')).toBe(`/recipe/${recipe.collectionId}/${recipe.id}`);
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

	it('should have the tagline of the recipe', () => {
		const { getByText } = render(RecipeCard, { recipe: recipe });

		const name = getByText(recipe.tagline);
		expect(name).not.toBeNull();
	});

	it('should have a default tagline when recipe tagline is empty', () => {
		recipe.tagline = '';
		const { getByText } = render(RecipeCard, { recipe: recipe });

		const name = getByText('Tagline');
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

	it('should show the correct number of tags', () => {
		const { getAllByTestId } = render(RecipeCard, { recipe: recipe });

		const tags = getAllByTestId('tag');
		expect(tags.length).toBe(recipe.tags!.length);
	});

	it('should show the text of all tags', () => {
		const { queryByText } = render(RecipeCard, { recipe: recipe });

		recipe.tags?.forEach((tag) => {
			const tagElement = queryByText(tag);
			expect(tagElement).not.toBeNull();
		});
	});

	it('should show only tags that are not empty', () => {
		recipe.tags?.push('');
		const { getAllByTestId } = render(RecipeCard, { recipe: recipe });

		const tags = getAllByTestId('tag');
		expect(tags.length).toBe(recipe.tags!.length - 1);
	});
});
