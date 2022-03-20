import { compose, curry, map, prop } from 'ramda'
import { scheduleCallback, shouldYield } from 'scheduler_sg'
import { getTime } from 'scheduler_sg'
import { pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { pushCommitItem, shiftCommitItem } from './commitQueue'
import { isFn, trampoline, consoleFunc } from '../utils'
import { getParentNode } from './getParentNode'

import { Either, Left, Right } from '../functor'

import { reconcileLoopBase, reconcileWork } from './reconcilerBase'

let WIP

export const render = (vnode, node, done) => {
  let rootFiber = {
    node,
    props: { children: vnode },
    done
  }
  // 其实就是 render 根结点用
  scheduleWork(rootFiber)
}

export const scheduleWork = (fiber) => {
  if (!fiber.dirty && (fiber.dirty = true)) {
    pushUpdateItem(fiber)
  }

  scheduleCallback(reconcileWork)
}

const preCommit = true // to change
// lpBase :: fiberFunctor -> 

