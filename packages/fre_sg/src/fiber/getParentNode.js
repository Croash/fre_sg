import { isFn, trampoline } from '../utils'

// export const getParentNode = fiber => {
//   // console.log('loop', fiber, fiber.type)
//   const loop = fiberIns => {
//     // console.log(!isFn(fiberIns.type) )
//     fiberIns = fiberIns.parent
//     console.log(fiberIns)

//     // fiberIns 未判空 想一下
//     return !isFn(fiberIns.type) ? fiberIns.node : (() => {
//       console.log(fiberIns)
//       fiberIns = fiberIns.parent
//       return () => loop(fiberIns)
//     })()
//   }
//   return trampoline(loop)(fiber)
// }

export function getParentNode(fiber) {
  while ((fiber = fiber.parent)) {
    // ifFn 其实处理的是function component组件，所以讲道理，普通组件会直接被获取到父节点 parentNode
    // function component 待看
    // !isFn，这里会直接获取到dom节点
    // console.log('fiber.node123',!isFn(fiber.type), fiber.parent)
    if (!isFn(fiber.type)) {
      return fiber.node
    }
  }
}
