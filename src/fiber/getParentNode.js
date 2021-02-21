import { trampoline } from '../utils'

export const getParentNode = fiber => {
  const loop = fiberIns => {
    fiberIns = fiberIns.parent
    return !isFn(fiberIns.type) ? fiberIns.node : loop(fiberIns)
  }
  return trampoline(loop)(fiber)
}
