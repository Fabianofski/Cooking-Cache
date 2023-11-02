import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyA1l0v30S0mbu8j7nsFEnE2AiwhftpSx2Q',
	authDomain: 'cooking-cache.firebaseapp.com',
	databaseURL: 'https://cooking-cache-default-rtdb.firebaseio.com',
	projectId: 'cooking-cache',
	storageBucket: 'cooking-cache.appspot.com',
	messagingSenderId: '172244835691',
	appId: '1:172244835691:web:fa515f32886f80b645c02e',
	measurementId: 'G-GJ4KDH38MW'
};

let app = initializeApp(firebaseConfig);
let auth = getAuth(app);

export { auth };
