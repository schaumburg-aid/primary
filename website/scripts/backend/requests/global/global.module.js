/* Imports */

/* security */
import { accessDenied } from '../../security/prevention/access/accessdenied.js';
import { accessLevelDenied } from '../../security/prevention/access/accessleveldenied.js';
import { initializeFirebase, firebase } from '../src/firebasesdk.js';
import { setRole, setrole, setlevel } from '../../security/roles/roles.module.js';
import { createAccount, signIn, UID, accountdata, disableaccount, deleteaccount } from '../../security/account/account.module.js';
/* global */
globalThis.accessDenied = accessDenied;
globalThis.accessLevelDenied = accessLevelDenied;
globalThis.initializeFirebase = initializeFirebase;
globalThis.firebase = firebase;
globalThis.createAccount = createAccount;
globalThis.signIn = signIn;
globalThis.UID = UID;
globalThis.accountdata = accountdata;
globalThis.disableaccount = disableaccount;
globalThis.deleteaccount = deleteaccount;
async function role(level, userId = (globalThis.currentUserId || null)) {
	if (!userId) throw new Error('Missing user id')
	await initializeFirebase()
	return setRole(userId, level)
}
globalThis.role = role
export { role }
globalThis.setrole = setrole
globalThis.setlevel = setlevel
export { setrole, setlevel }

/* nessecary */

initializeFirebase();
