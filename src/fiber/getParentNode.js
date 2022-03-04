import { isFn, trampoline } from '../utils'

export const getParentNode = fiber => {
  console.log('loop', fiber.type)
  const loop = fiberIns => {
    // console.log(!isFn(fiberIns.type) )
    // fiberIns 未判空 想一下
    return !isFn(fiberIns.type) ? fiberIns.node : (() => {
      fiberIns = fiberIns.parent
      return loop
    })()
  }
  return trampoline(loop)(fiber)
}
