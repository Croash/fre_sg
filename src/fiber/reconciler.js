import { compose, curry, map, prop } from 'ramda'
import { scheduleCallback, shouldYield } from '../scheduler'
import { getTime } from '../scheduler/common'
import { updateQueueFunctor, pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { pushCommitItem, shiftCommitItem } from './commitQueue'
import { isFn, trampoline, consoleFunc } from '../utils'
import { getParentNode } from './getParentNode'

import { Either, Left, Right } from '../functor'

let WIP

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
  console.log('cfff', fiber)
  if (!fiber.dirty && (fiber.dirty = true)) {
    pushUpdateItem(fiber)
  }
  console.log('fiber', fiber)
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
const reconcileLoop = (didout, fiber) => {
  const fiberNext = reconcile(fiber)
  console.log('fiberNext', fiberNext)
  return fiberNext ? () => reconcileLoop(didout, fiberNext) : null
}

const preCommit = true // to change
// lpBase :: fiberFunctor -> 
const reconcileLoopBase = compose(
  Either(
    () => { console.log('nilFiber'); return null },
    // consoleFunc('finish'),
    compose(
      // fiber console? WIP?
      consoleFunc('fiberFinish'),
      map(
        compose(
          Either(
            consoleFunc('fiberF'),
            map(fiberIns => {
              const loop = ins => {
                console.log('ins', ins)
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
          consoleFunc('getFiber from arr'),
          (arr) => arr.shift(),
        )
      ),
      consoleFunc('fiber_test'),
      prop('_value'),
      // map nesty the functor into _value, need to prop('_value'),
      // use lift ?? i think
      // or too junk code
      map(pushCommitItem),
      // tag 0306-1115
      // tag 0303-2356
      Either(
        // todo
        // updateHOOK
        fiberFunctor => fiberFunctor,
        // updateHOST
        fiberFunctor => fiberFunctor,
      ),
      // map
      fiber => {
        console.log('fff', fiber)
        return isFn(fiber.type) ? Right.of(fiber) : Left.of(fiber)
      },
      prop('_value'),
      // get fiber's parent and set parent value
      // and update fiber dirty props and oldProps
      // fiber :: fiber -> fiber
      map(
        (fiberIns) => 
          compose(
            fiber => {
              Object.assign(fiberIns, {
                parentNode: fiber,
              })
              return fiberIns
            },
            // get this fiber's parent
            fiber => getParentNode(fiber),
          )(fiberIns),
      ),
    ),
  ),
  (didout, fiberIns) => {
    console.log('!d', !didout)
    return !didout ? Right.of(fiberIns) : Left.of(null)
  },
)

// const reconcileBase = curry()

// reconcileWork :: didout -> ( () => {}|null )
const reconcileWork = compose(
  (didout) => {
    WIP = shiftUpdateItem()._value
    console.log('cf', curFiber)
    // trampoline change to closure
    return trampoline(curry(reconcileLoopBase)(didout))(WIP)
  },
  consoleFunc('didoutM'),
)
