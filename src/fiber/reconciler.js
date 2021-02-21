import { compose, curry, map, props } from 'ramda'
import { scheduleCallback, shouldYield } from '../scheduler'
import { getTime } from '../scheduler/common'
import { updateQueueFunctor, pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { pushCommitItem } from './commitQueue'
import { isFn, trampoline } from '../utils'
import { getParentNode } from './getParentNode'

import { Either, Left, Right } from '../functor'

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
const reconcile = fiber => {
  let num = 10
  const res = fiberMock > num ? null : fiber
  if(fiberMock >= num-1) {
    console.log(fiberMock)
  }
  fiberMock > num ? fiberMock = 0 : fiberMock ++
  // console.log('res', res, fiberMock)
  return res
}

// reconcileLoop :: didout -> 
const reconcileLoop = (didout, fiber, time) => {
  // shouldYield 没想到怎么处理成参数，怎么curryfy
  // use liftA2
  // console.log(shouldYieldStatus)
  const fiberNext = reconcile(fiber)
  return fiberNext ? () => reconcileLoop(didout, fiberNext, time) : null
}

const preCommit = true // to change
// lpBase :: fiberFunctor -> 
const reconcileLoopBase = compose(
  map(
    Either(
      fiberF => fiberF,
      map(fiberIns => {
        const loop = ins => {
          if (fiber) {
            if (fiber.sibling) {
              return fiber.sibling
            }
            if (!preCommit && fiber.dirty === false) {
              // console.log('first', WIP)
              preCommit = WIP
              return null
            }
          }
          return fiber.parent
        }
        return trampoline(loop)(fiberIns)
      })
    ),
    fiber => fiber.child ? Right.of(fiber) : Left.of(fiber),
  ),

  map(pushCommitItem),

  Either(
    // todo
    // updateHOOK
    fiberF => fiberF,
    // updateHOST
    fiberF => fiberF,
  ),
  // map
  fiber => {
    return isFn(fiber.type) ? Right.of(fiber) : Left.of(fiber)
  },
    
  // get fiber's parent and set parent value
  // and update fiber dirty props and oldProps
  // fiber :: fiber -> fiber
  fiberIns => {
    return compose(
      f => { console.log('f'); return f },
      fiber => {
        Object.assign(fiberIns, {
          parentNode: fiber,
        })
        return fiberIns
      },
      // get this fiber's parent
      fiber => getParentNode(fiber)
    )
  }

)

// const reconcileBase = curry()

// reconcileWork :: didout -> ( () => {}|null )
const reconcileWork = compose(
  (v) => {
    console.log('v', v)
    console.log('gtt', getTime())
    return v
  },
  (didout) => {
    const curFiber = shiftUpdateItem()
    return trampoline(reconcileLoop)(didout, curFiber, getTime())
  }
)
