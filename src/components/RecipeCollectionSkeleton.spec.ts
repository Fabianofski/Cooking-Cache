import { describe, expect, it } from 'vitest';
import RecipeCollectionSkeleton from './RecipeCollectionSkeleton.svelte';
import { render } from '@testing-library/svelte';

describe('RecipeCollectionSkeleton', () => {
	it('should render a skeleton', () => {
		const {} = render(RecipeCollectionSkeleton);
		expect(true).toBe(true);
	});
});
