import admin from 'firebase-admin';
import { PRIVATE_KEY, PROJECT_ID, CLIENT_EMAIL } from '$env/static/private';

const firebaseConfig = {
	credential: admin.credential.cert({
		projectId: PROJECT_ID,
		privateKey: PRIVATE_KEY.replace(/\\n/g, '\n'),
		clientEmail: CLIENT_EMAIL
	})
};

admin.initializeApp(firebaseConfig);
const storage = admin.storage();
const firestore = admin.firestore();

export { admin, storage, firestore };
