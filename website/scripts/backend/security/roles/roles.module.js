import { initializeFirebase, firebase } from '../../requests/src/firebasesdk.js'
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'

const LEVELS = {
	1: { name: 'Level 1', title: 'Tester', description: 'Trial Tester / Tester / Senior Tester / Beta Tester', permissions: [1] },
	2: { name: 'Level 2', title: 'Moderator', description: 'Tester Manager / Junior Moderator / Moderator / Support Team', permissions: [1,2] },
	3: { name: 'Level 3', title: 'Senior Moderator', description: 'Senior Moderator / Head Moderator / Trial Administrator', permissions: [1,2,3] },
	4: { name: 'Level 4', title: 'Administrator', description: 'Junior Administrator / Administrator / Senior Administrator', permissions: [1,2,3,4] },
	5: { name: 'Level 5', title: 'Developer', description: 'Administrator Manager / Developer / Lead Developer / Site Manager', permissions: [1,2,3,4,5] },
	6: { name: 'Level 6', title: 'Creator', description: 'Creator', permissions: [1,2,3,4,5,6] }
}

function getDB() {
	const app = firebase.getApp() || initializeFirebase()
	return getFirestore(app)
}

async function getRole(userId) {
	const db = getDB()
	const snap = await getDoc(doc(db, 'accounts', String(userId)))
	if (!snap.exists()) return null
	const data = snap.data()
	return { level: data.role || null, title: data.roleTitle || null, meta: data.roleMeta || null, updatedAt: data.roleUpdatedAt || null }
}

async function setRole(userId, level, meta = {}) {
	if (!LEVELS[level]) throw new Error('Invalid level')
	const db = getDB()
	const ref = doc(db, 'accounts', String(userId))
	const payload = Object.assign({}, meta, { role: Number(level), roleTitle: LEVELS[level].title, roleMeta: meta, roleUpdatedAt: serverTimestamp() })
	await setDoc(ref, payload, { merge: true })
	return payload
}

async function deleteRole(userId) {
	const db = getDB()
	const ref = doc(db, 'accounts', String(userId))
	await updateDoc(ref, { role: null, roleTitle: null, roleMeta: null, roleUpdatedAt: serverTimestamp() })
	return true
}

async function listRoles() {
	const db = getDB()
	const snaps = await getDocs(collection(db, 'accounts'))
	return snaps.docs.map(d => Object.assign({ id: d.id }, d.data())).filter(d => d.role !== undefined && d.role !== null)
}

async function findUsersWithLevel(level) {
	const db = getDB()
	const q = query(collection(db, 'accounts'), where('role', '==', Number(level)))
	const snaps = await getDocs(q)
	return snaps.docs.map(d => Object.assign({ id: d.id }, d.data()))
}

function roleHasPermission(userLevelOrObj, requiredLevel) {
	const level = typeof userLevelOrObj === 'object' ? (userLevelOrObj.level || 0) : (Number(userLevelOrObj) || 0)
	return level >= requiredLevel
}

export { LEVELS, getRole, setRole, deleteRole, listRoles, findUsersWithLevel, roleHasPermission }

const NAME_TO_LEVEL = {
	owner: 6,
	creator: 6,
	developer: 5,
	dev: 5,
	'lead developer': 5,
	administrator: 4,
	admin: 4,
	'senior administrator': 4,
	'senior moderator': 3,
	'head moderator': 3,
	moderator: 2,
	mod: 2,
	tester: 1,
	'beta tester': 1
}

async function setrole(name, userId = (globalThis.currentUserId || null), meta = {}) {
	const key = String(name || '').toLowerCase()
	const level = NAME_TO_LEVEL[key]
	if (!level) throw new Error('Invalid role name')
	if (!userId) throw new Error('Missing user id')
	return setRole(userId, level, meta)
}

async function setlevel(level, userId = (globalThis.currentUserId || null), meta = {}) {
	if (!LEVELS[level]) throw new Error('Invalid level')
	if (!userId) throw new Error('Missing user id')
	return setRole(userId, Number(level), meta)
}

export { setrole, setlevel }
console.log("[Roles Module]: Loaded")

