console.log("[AC Module]: Loaded")
import { signup } from './load/signup.js';
import { deletion } from './load/deletion.js';

async function createAccount(email, password, username = null) {
	return signup(email, password, username);
}

async function deleteAccountByEmail(email) {
	return deletion(email);
}

export { createAccount, deleteAccountByEmail };