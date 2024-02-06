import { admin, auth, bucket, database } from './firebase.admin';
import { describe, expect, it } from 'vitest';

describe('Firebase Client', () => {
	it('should create firebase admin object', () => {
		expect(admin).not.toBeNull();
	});

	it('should create firebase auth object', () => {
		expect(auth).not.toBeNull();
	});

	it('should create firebase bucket object', () => {
		expect(bucket).not.toBeNull();
	});

	it('should create firebase database object', () => {
		expect(database).not.toBeNull();
	});
});
