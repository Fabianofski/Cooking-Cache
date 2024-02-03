import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type AlertOptions from '../../models/AlertOptions';
import { alertStore, createNewAlert } from './alert.handler';

describe('Alert Handler', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		alertStore.set({});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should add an alert to store on create a new alert', () => {
		const spy = vi.fn();
		alertStore.subscribe(spy);

		const testAlert: AlertOptions = { message: 'Test alert', type: 'error' };
		createNewAlert(testAlert);

		const savedAlerts = spy.mock.calls[0][0];
		expect(Object.keys(savedAlerts).length).toBe(1);
	});

	it('should add a unique id to an alert', () => {
		const spy = vi.fn();
		alertStore.subscribe(spy);

		const testAlert: AlertOptions = { message: 'Test alert', type: 'error' };
		createNewAlert(testAlert);

		const savedAlerts = spy.mock.calls[0][0];
		const alertId = Object.keys(savedAlerts)[0];
		expect(alertId).toBeDefined();
		expect(savedAlerts[alertId].id).toBe(alertId);
	});

	it('should remove an alert from store after lifetime', () => {
		const spy = vi.fn();
		alertStore.subscribe(spy);

		const testAlert: AlertOptions = { message: 'Test alert', type: 'error', lifetime: 1 };
		createNewAlert(testAlert);

		let savedAlerts = spy.mock.calls[0][0];
		expect(Object.keys(savedAlerts).length).toBe(1);

		vi.advanceTimersByTime(1000);

		expect(Object.keys(savedAlerts).length).toBe(0);
	});
});
