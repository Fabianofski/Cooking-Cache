import admin from 'firebase-admin';
import { PRIVATE_KEY, PROJECT_ID, CLIENT_EMAIL, DATABASE_URL } from '$env/static/private';

const firebaseConfig = {
	credential: admin.credential.cert({
		projectId: PROJECT_ID,
		privateKey: PRIVATE_KEY.replace(/\\n/g, '\n'),
		clientEmail: CLIENT_EMAIL
	}),
	databaseURL: DATABASE_URL
};

admin.initializeApp(firebaseConfig);
const storage = admin.storage();
const database = admin.database();

export { admin, storage, database };
