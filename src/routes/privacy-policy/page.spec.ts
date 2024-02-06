import { describe, it, expect } from 'vitest';
import PrivacyPolicy from './+page.svelte';
import { render } from '@testing-library/svelte';

describe('Privacy Policy', () => {
	it('should render the title', () => {
		const { queryByText } = render(PrivacyPolicy);
		const privacyPolicy = queryByText('Datenschutzerklärung');
		expect(privacyPolicy).not.toBeNull();
	});
});
