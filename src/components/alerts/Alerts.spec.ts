import { describe, it, expect, vi } from 'vitest';
import Alerts from './Alerts.svelte';
import { render } from '@testing-library/svelte';
import type AlertOptions from '../../models/AlertOptions';
import { alertStore } from './alert.handler';

describe('Alerts', () => {
	it('should render one alert in the store', () => {
		const alertOption: AlertOptions = {
			type: 'error',
			message: 'Alert message',
			id: '1',
			lifetime: 300
		};
		alertStore.set({ '1': alertOption });
		const { queryByTestId } = render(Alerts);
		const alert = queryByTestId('alert');
		expect(alert).not.toBeNull();
	});

	it('should render multiple alerts in the store', () => {
		const alerts: { [key: string]: AlertOptions } = {};
		for (let i = 1; i <= 3; i++) {
			const alertOption: AlertOptions = {
				type: 'error',
				message: 'Alert message',
				lifetime: 300,
				id: i.toString()
			};
			alerts[i.toString()] = alertOption;
		}
		alertStore.set(alerts);

		const { queryAllByTestId } = render(Alerts);
		const alert = queryAllByTestId('alert');
		expect(alert).toHaveLength(3);
	});

	it('should not render alerts that got removed from alert store', () => {
		const alerts: { [key: string]: AlertOptions } = {};
		for (let i = 1; i <= 3; i++) {
			const alertOption: AlertOptions = {
				type: 'error',
				message: 'Alert message',
				lifetime: 300,
				id: i.toString()
			};
			alerts[i.toString()] = alertOption;
		}
		alertStore.set(alerts);

		const { queryAllByTestId, rerender } = render(Alerts);
		const alert = queryAllByTestId('alert');
		expect(alert).toHaveLength(3);

		delete alerts['1'];
		alertStore.set(alerts);
		rerender({});
		const alertAfterDelete = queryAllByTestId('alert');
		expect(alertAfterDelete).toHaveLength(2);
	});

	it('should not display an alert anymore when clicked', () => {
		const alertOption: AlertOptions = {
			type: 'error',
			message: 'Alert message',
			id: '1',
			lifetime: 300
		};
		alertStore.set({ '1': alertOption });
		const { queryByTestId, rerender } = render(Alerts);
		let alert = queryByTestId('alert');
		alert?.click();

		const spy = vi.fn((alerts) => {
			expect(alerts).toEqual({});
			rerender({});
			alert = queryByTestId('alert');
			expect(alert).toBeNull();
		});
		alertStore.subscribe(spy);
	});
});
