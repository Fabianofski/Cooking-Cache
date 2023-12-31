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

async function uploadFileToStorage(file: File, path: string): Promise<string> {
	return await new Promise<string>(async (resolve, reject) => {
		try {
			const magic = new Magic();
			const coverData = Buffer.from(await file.arrayBuffer());
			magic.detect(coverData, async (err: any, result: any) => {
				if (err) {
					reject(err);
					return;
				}
				if (!result.includes('image data')) {
					reject(new Error('Not an image'));
					return;
				}

				const reference = bucket.file(path);
				await reference.save(coverData, {
					metadata: {
						contentType: file.type
					}
				});

				reference
					.getSignedUrl({
						action: 'read',
						expires: '01-01-2100'
					})
					.then((signedUrls) => {
						const downloadUrl = signedUrls[0];
						resolve(downloadUrl);
					});
			});
		} catch (err) {
			console.error(err);
			reject(err);
		}
	});
}

function verifyIdToken(token: string | null): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!token) reject(new Error('Token is null'));
		else
			auth
				.verifyIdToken(token)
				.then((decodedToken) => {
					resolve(decodedToken.uid);
				})
				.catch((err) => {
					reject(err);
				});
	});
}

export { admin, auth, bucket, database, uploadFileToStorage, verifyIdToken };
