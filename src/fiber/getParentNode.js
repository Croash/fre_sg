import { isFn, trampoline } from '../utils'

export const getParentNode = fiber => {
  const loop = fiberIns => {
    return !isFn(fiberIns.type) ? fiberIns.node : loop(fiberIns)
  }
  return trampoline(loop)(fiber)
}
