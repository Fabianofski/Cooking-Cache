import { describe, it, expect } from 'vitest';
import Alert from './Alert.svelte';
import { render } from '@testing-library/svelte';
import type AlertOptions from '../../models/AlertOptions';

describe('Alert', () => {
	it.each([['error'], ['warning'], ['info'], ['success']])(
		'should render the icon and message of a %s alert',
		(type) => {
			const { queryByTestId, queryByText } = render(Alert, {
				// @ts-ignore
				alertOptions: { type: type, message: type + ' message' }
			});
			const icon = queryByTestId(type + '-icon');
			const message = queryByText(type + ' message');
			expect(message).not.toBeNull();
			expect(icon).not.toBeNull();
		}
	);

	it.each([['error'], ['warning'], ['info'], ['success']])(
		'should add the correct alert class of a %s alert',
		(type) => {
			const { queryByTestId } = render(Alert, {
				// @ts-ignore
				alertOptions: { type: type, message: 'Alert message' }
			});
			const alert = queryByTestId('alert');
			expect(alert?.classList).toContain('alert-' + type);
		}
	);

	it('should hide the alert when lifetime is reached', () => {
		const alertOption: AlertOptions = {
			type: 'error',
			message: 'Alert message',
			id: '1',
			lifetime: 300
		};
		const { queryByTestId } = render(Alert, {
			alertOptions: alertOption
		});
		const alert = queryByTestId('alert');
		expect(getComputedStyle(alert!).getPropertyValue('--lifetime')).toBe('300s');
	});
});
