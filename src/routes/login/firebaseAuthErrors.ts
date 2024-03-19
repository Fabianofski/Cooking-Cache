export const firebaseAuthErrors: {
	[key: string]: string;
} = {
	'auth/invalid-email': 'Ungültige E-Mail-Adresse',
	'auth/email-already-in-use': 'E-Mail-Adresse wird bereits verwendet',
	'auth/user-not-found': 'Benuzter nicht gefunden',
	'auth/invalid-credential': 'Ungültige E-Mail-Adresse oder Passwort',
	'auth/email-already-exists': 'E-Mail-Adresse wird bereits verwendet',
	'auth/operation-not-allowed': 'Anmeldung mit E-Mail und Passwort ist nicht aktiviert',
	'auth/weak-password': 'Passwort muss mindestens 6 Zeichen lang sein'
};
