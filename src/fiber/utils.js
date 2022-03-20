import { isFn } from '../utils'

export function shouldUpdate(a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}

export function shouldPlace(fiber) {
  let p = fiber.parent
  if (isFn(p.type)) return p.key && !p.dirty
  return fiber.key
}

export function cloneChildren(fiber) {
  if (!fiber.child) return
  let child = fiber.child
  let newChild = child
  newChild.op = NOWORK
  fiber.child = newChild
  newChild.parent = fiber
  // sibling = null ??? 了解 因为 
  newChild.sibling = null
}
