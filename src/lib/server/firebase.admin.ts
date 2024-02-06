import {
	CLIENT_EMAIL,
	DATABASE_URL,
	PRIVATE_KEY,
	PROJECT_ID,
	STORAGE_URL
} from '$env/static/private';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { Magic } from 'mmmagic';

const firebaseConfig = {
	credential: admin.credential.cert({
		projectId: PROJECT_ID,
		privateKey: PRIVATE_KEY.replace(/\\n/g, '\n'),
		clientEmail: CLIENT_EMAIL
	}),
	databaseURL: DATABASE_URL,
	storageBucket: STORAGE_URL
};

admin.initializeApp(firebaseConfig);
const bucket = admin.storage().bucket();
const database = admin.database();
const auth = getAuth();

export { admin, auth, bucket, database };
