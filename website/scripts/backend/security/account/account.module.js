console.log("[Account Module]: Loaded")
import { initializeFirebase, firebase } from '../../requests/src/firebasesdk.js';
import { getAuth, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { createAccount as createAccountFromCreation } from './creation/creation.module.js';
import { getAccountByUID, findAccountByEmail, findAccountByUsername, accountdata as storageAccountData, disableAccount } from './storage/accountdata.module.js';
import { deletion as deletionLoader } from './creation/load/deletion.js';

function ensureAuth() {
	const app = initializeFirebase();
	return getAuth(app);
}

const createAccount = createAccountFromCreation;

async function signIn(email, password) {
	const auth = ensureAuth();
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const uid = userCredential.user && userCredential.user.uid;
		const account = await getAccountByUID(uid);
		if (account && account.disabled) {
			await signOut(auth);
			console.log('Account disabled');
			const err = new Error('Account disabled');
			err.code = 'account/disabled';
			throw err;
		}
		console.log('sign in');
		return userCredential;
	} catch (err) {
		if (err && (err.code === 'auth/wrong-password' || (err.message && err.message.toLowerCase().includes('wrong-password')))) {
			console.log('Incorrect Password');
		} else {
			console.log(err.code || err.message || err);
		}
		throw err;
	}
}

function UID() {
	const app = firebase.getApp() || initializeFirebase();
	const auth = getAuth(app);
	const user = auth.currentUser;
	console.log(user ? user.uid : null);
	return user ? user.uid : null;
}

async function accountdata(identifier) {
	if (typeof identifier !== 'string') return null;
	const isEmail = identifier.includes('@');
	if (isEmail) {
		const found = await findAccountByEmail(identifier);
		const data = found ? found.data : null;
		console.log(data);
		return data;
	} else {
		const found = await findAccountByUsername(identifier);
		const data = found ? found.data : null;
		console.log(data);
		return data;
	}
}

async function disableaccount(email) {
	const result = await disableAccount(email);
	const auth = ensureAuth();
	const user = auth.currentUser;
	if (user && user.email === email) await signOut(auth);
	console.log('disabled');
	return result;
}

async function deleteaccount(email) {
	const result = await deletionLoader(email);
	const auth = ensureAuth();
	const user = auth.currentUser;
	if (user && user.email === email) {
		try { await user.delete(); } catch (e) {}
		console.log('deleted');
		return result;
	}
	console.log('deleted (firestore only)');
	return result;
}

globalThis.createAccount = createAccount;
globalThis.signIn = signIn;
globalThis.UID = UID;
globalThis.accountdata = accountdata;
globalThis.disableaccount = disableaccount;
globalThis.deleteaccount = deleteaccount;

export { createAccount, signIn, UID, accountdata, disableaccount, deleteaccount };
