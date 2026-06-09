import { initializeFirebase } from '../../../../requests/src/firebasesdk.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { findAccountByEmail, deleteAccount as deleteAccountDoc } from '../../storage/accountdata.module.js';

function ensureAuth() {
    const app = initializeFirebase();
    return getAuth(app);
}

async function deletion(email) {
    const found = await findAccountByEmail(email);
    if (!found) throw new Error('Account not found');
    await deleteAccountDoc(email);
    const auth = ensureAuth();
    const user = auth.currentUser;
    if (user && user.email === email) {
        try { await user.delete(); console.log('deleted'); return true; } catch (e) {}
    }
    console.log('deleted (firestore only)');
    return true;
}

export { deletion };
