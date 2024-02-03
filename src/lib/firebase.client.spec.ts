import { auth } from './firebase.client';
import { describe, expect, it } from 'vitest';

describe('Firebase Client', () => {
	it('should create firebase auth object', () => {
		expect(auth).not.toBeNull();
	});
});
