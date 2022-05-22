import { map, compose } from 'ramda'
import { planWork } from 'scheduler_sg'
import { commitQueueFunctor, shiftCommitItem } from '../commitQueue'
import { updateElement } from '../../dom/dom'
import { NOWORK, PLACE, UPDATE, DELETE, SVG } from '../constant'
import { isFn } from '../../utils'
import { updateWIP } from '../WIP'
import { clearPreCommit } from '../reconcilerBase'

const refer = (ref, dom) => {
  if (ref) isFn(ref) ? ref(dom) : (ref.current = dom)
}

const cleanupRef = (kids) => {
  for (const k in kids) {
    const kid = kids[k]
    refer(kid.ref, null)
    if (kid.kids) cleanupRef(kid.kids)
  }
}

const effect = e => {
  const res = e[0]()
  if (isFn(res)) e[2] = res
}

const cleanup = e => e[2] && e[2]()

const commit = (fiber) => {

  const { op, parentNode, node, ref, hooks } = fiber
  if (op === NOWORK) {
  } else if (op === DELETE) {
    hooks && hooks.list.forEach(cleanup)
    cleanupRef(fiber.kids)
    while (isFn(fiber.type)) fiber = fiber.child
    parentNode.removeChild(fiber.node) // 这tmd是dom的操作吧
  } else if (isFn(fiber.type)) {
    if (hooks) {
      // 先处理layout，再清理effect？？
      hooks.layout.forEach(cleanup)
      hooks.layout.forEach(effect)
      hooks.layout = []
      planWork(() => {
        hooks.effect.forEach(cleanup)
        hooks.effect.forEach(effect)
        hooks.effect = []
      })
    }
  } else if (op === UPDATE) {
    updateElement(node, fiber.lastProps, fiber.props)
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null
    // pointpoint 这里，fre的代码未执行root，我这里执行了root，这是为什么呢
    let after = point ? point.nextSibling : parentNode.firstChild
    if (after === node) return
    if (after === null && node === parentNode.lastChild) return
    parentNode.insertBefore(node, after)
  }

  refer(ref, node)
  // NOWORK 不需要做操作
  // DELETE 删除
  // hooksFn ?? 不理解
  // UPDATE 更新
  // 其余为插入新节点 即为 PLACE
}

export const commitWork = (fiber) => {
  // fiber 是 root节点，不需要commit？
  while (commitQueueFunctor._value?.length > 0) {
    map(compose(cmtFiber => {
      cmtFiber?.parent && commit(cmtFiber)
    }))(shiftCommitItem())
  }

  fiber.done && fiber.done()
  // commitQueue = []// 已经为空
  // preCommit = null
  clearPreCommit()
  updateWIP(null)
  // WIP = null


}