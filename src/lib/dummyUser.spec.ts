import { describe, expect, it } from 'vitest';
import { testUser } from './dummyUser';

describe('Dummy User', () => {
	it('should throw error on delete', () => {
		expect(testUser.delete).toThrow();
	});

	it('should throw error on getIdToken', () => {
		expect(testUser.getIdToken).toThrow();
	});

	it('should throw error on getIdTokenResult', () => {
		expect(testUser.getIdTokenResult).toThrow();
	});

	it('should throw error on reload', () => {
		expect(testUser.reload).toThrow();
	});

	it('should throw error on toJSON', () => {
		expect(testUser.toJSON).toThrow();
	});
});
