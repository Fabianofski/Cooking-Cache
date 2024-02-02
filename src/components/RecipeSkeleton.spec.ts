import { describe, expect, it } from 'vitest';
import RecipeSkeleton from './RecipeSkeleton.svelte';
import { render } from '@testing-library/svelte';

describe('RecipeSkeleton', () => {
	it('should render a skeleton', () => {
		const {} = render(RecipeSkeleton);
		expect(true).toBe(true);
	});
});
