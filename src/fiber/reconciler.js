import { compose, curry, map, props } from 'ramda'
import { scheduleCallback, shouldYield } from '../scheduler'
import { getTime } from '../scheduler/common'
import { updateQueueFunctor, pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { trampoline } from '../utils'
import { push } from '../utils/heapify'

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

// reconcile :: fiber -> fiber
// 叫weaver也不是不可以，毕竟是用来编织整体fiber网的函数
// fiberMock : fiber计数用
let fiberMock = 2
const reconcileMock = fiber => {
  let num = 10000
  const res = fiberMock > num ? null : fiber
  if(fiberMock >= num-1) {
    console.log(fiberMock)
  }
  fiberMock > num ? fiberMock = 0 : fiberMock ++
  // console.log('res', res, fiberMock)
  return res
}
const reconcile = fiber => fiber

// reconcileLoop :: didout -> 
const reconcileLoop = (didout, shouldYieldStatus, fiber) => {
  // shouldYield 没想到怎么处理成参数，怎么curryfy
  // use liftA2
  // console.log(shouldYieldStatus)
  const fiberNext = reconcileMock(fiber)
  return fiberNext ? () => reconcileLoop(didout, shouldYield(), fiberNext) : null
}

// const reconcileBase = curry()

// reconcileWork :: didout -> ( () => {}|null )
const reconcileWork = compose(
  (v) => {
    console.log(v)
    console.log(getTime())
    return v
  },
  (didout) => {
    const curFiber = shiftUpdateItem()
    return trampoline(reconcileLoop)(didout, shouldYield(), curFiber)
  }
)

// window.shouldYield = shouldYield

// window.reconcileMock = reconcileMock

// window.pushUpdateItem = pushUpdateItem

// window.updateQueueFunctor = updateQueueFunctor

// window.shiftUpdateItem = shiftUpdateItem

// window.reconcileWork = reconcileWork
