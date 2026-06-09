console.log("[AD Module]: Loaded")
import { initializeFirebase } from '../../../requests/src/firebasesdk.js';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

function ensureDB() {
	const app = initializeFirebase();
	return getFirestore(app);
}

async function createAccountData(uid, email, username) {
	const db = ensureDB();
	const ref = doc(db, 'accounts', uid);
	const data = {
		role: 'user',
		email: email,
		username: username || (email.split('@')[0]),
		violations: [],
		bans: [],
		disabled: false
	};
	await setDoc(ref, data);
	return data;
}

async function getAccountByUID(uid) {
	if (!uid) return null;
	const db = ensureDB();
	const ref = doc(db, 'accounts', uid);
	const snap = await getDoc(ref);
	return snap.exists() ? snap.data() : null;
}

async function findAccountByEmail(email) {
	if (!email) return null;
	const db = ensureDB();
	const accounts = collection(db, 'accounts');
	const q = query(accounts, where('email', '==', email));
	const snaps = await getDocs(q);
	if (snaps.empty) return null;
	return { ref: snaps.docs[0].ref, data: snaps.docs[0].data() };
}

async function findAccountByUsername(username) {
	if (!username) return null;
	const db = ensureDB();
	const accounts = collection(db, 'accounts');
	const q = query(accounts, where('username', '==', username));
	const snaps = await getDocs(q);
	if (snaps.empty) return null;
	return { ref: snaps.docs[0].ref, data: snaps.docs[0].data() };
}

async function accountdata(identifier) {
	if (typeof identifier !== 'string') return null;
	const isEmail = identifier.includes('@');
	if (isEmail) {
		const found = await findAccountByEmail(identifier);
		if (!found) return null;
		console.log(found.data.username || null);
		return found.data.username || null;
	} else {
		const found = await findAccountByUsername(identifier);
		if (!found) return null;
		console.log(found.data.email || null);
		return found.data.email || null;
	}
}

async function disableAccount(email) {
	const found = await findAccountByEmail(email);
	if (!found) throw new Error('Account not found');
	await updateDoc(found.ref, { disabled: true });
	return true;
}

async function deleteAccount(email) {
	const found = await findAccountByEmail(email);
	if (!found) throw new Error('Account not found');
	await deleteDoc(found.ref);
	return true;
}

export { createAccountData, getAccountByUID, findAccountByEmail, findAccountByUsername, accountdata, disableAccount, deleteAccount };