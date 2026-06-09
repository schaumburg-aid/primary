import { createUserWithEmailAndPassword, getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { initializeFirebase } from '../../../../requests/src/firebasesdk.js';
import { createAccountData, findAccountByEmail, findAccountByUsername } from '../../storage/accountdata.module.js';

function ensureAuth() {
	const app = initializeFirebase();
	return getAuth(app);
}

async function signup(email, password, username = null) {
	const auth = ensureAuth();
	try {
		const existingEmail = await findAccountByEmail(email);
		if (existingEmail) {
			const err = new Error('Email already in use');
			err.code = 'signup/email-already-in-use';
			throw err;
		}
		const suggested = username || (email.split('@')[0]);
		const existingUsername = await findAccountByUsername(suggested);
		if (existingUsername) {
			const err = new Error('Username already in use');
			err.code = 'signup/username-already-in-use';
			throw err;
		}
		const cred = await createUserWithEmailAndPassword(auth, email, password);
		const uid = cred.user && cred.user.uid;
		try {
			await createAccountData(uid, email, username);
		} catch (e) {
			try { if (cred.user && cred.user.delete) await cred.user.delete(); } catch (_) {}
			throw e;
		}
		console.log(`[DCI]: Account created with the email: ${email}, password: ${password}, with the UID: ${uid}. Do not share your UID anywhere!`);
		return cred;
	} catch (err) {
		console.log(err.code || err.message || err);
		throw err;
	}
}

export { signup };
