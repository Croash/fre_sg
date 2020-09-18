import { scheduleCallback } from '../scheduler'
import { pushUpdateItem } from './updateQueue'


export function render(vnode, node, done) {
  let rootFiber = {
    node,
    props: { children: vnode },
    done
  }
  // 其实就是 render 根结点用
  scheduleWork(rootFiber)
}

export function scheduleWork(fiber) {
  if (!fiber.dirty && (fiber.dirty = true)) {
    pushUpdateItem(fiber)
  }
  scheduleCallback(reconcileWork)
}