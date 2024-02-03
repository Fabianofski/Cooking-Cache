import { describe, it, expect } from 'vitest';
import Planner from './+page.svelte';
import { render } from '@testing-library/svelte';

describe('Planner Page', () => {
	it('should render the planner page', () => {
		const { queryByText } = render(Planner);
		const plannerPage = queryByText('Wochenplaner');
		expect(plannerPage).not.toBeNull();
	});
});
