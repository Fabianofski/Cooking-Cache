import type { IdTokenResult, User, UserMetadata } from 'firebase/auth';

const userMetadata: UserMetadata = {};
const testUser: User = {
	emailVerified: false,
	isAnonymous: false,
	metadata: userMetadata,
	providerData: [],
	refreshToken: '',
	tenantId: null,
	delete: function (): Promise<void> {
		throw new Error('Function not implemented.');
	},
	getIdToken: function (forceRefresh?: boolean | undefined): Promise<string> {
		throw new Error('Function not implemented.');
	},
	getIdTokenResult: function (forceRefresh?: boolean | undefined): Promise<IdTokenResult> {
		throw new Error('Function not implemented.');
	},
	reload: function (): Promise<void> {
		throw new Error('Function not implemented.');
	},
	toJSON: function (): object {
		throw new Error('Function not implemented.');
	},
	displayName: 'Test User',
	email: 'test@test.com',
	phoneNumber: '0123456790',
	photoURL: 'https://www.test.com/test.jpg',
	providerId: '',
	uid: '0987654321-1234567890'
};

export { testUser };
