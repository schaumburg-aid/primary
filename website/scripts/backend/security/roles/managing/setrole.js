import { accessDenied } from '../../prevention/access/accessdenied.js'
import { getRole, setRole, roleHasPermission } from '../roles.module.js'

async function setRoleByActor(actorId, targetId, level, meta = {}) {
	const actor = await getRole(actorId)
	if (!actor) return accessDenied()
	if (!roleHasPermission(actor.level, 5)) return accessDenied()
	return await setRole(targetId, level, meta)
}

async function setRoleAsActor(level, targetId = (globalThis.currentUserId || null), meta = {}) {
	const actorId = globalThis.currentUserId || null
	if (!actorId) return accessDenied()
	const finalTarget = targetId || actorId
	return await setRoleByActor(actorId, finalTarget, level, meta)
}

async function setRolesBatch(actorId, assignments = []) {
	if (!Array.isArray(assignments)) throw new Error('assignments must be an array')
	const ops = assignments.map(a => setRoleByActor(actorId, a.id, a.level, a.meta || {}))
	return Promise.all(ops)
}

export { setRoleByActor, setRoleAsActor, setRolesBatch }
