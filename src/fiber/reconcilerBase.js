import { compose, curry, map, prop } from 'ramda'
import { scheduleCallback, shouldYield, getTime } from 'scheduler_sg'
// import { getTime } from '../scheduler/common'
import { pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { pushCommitItem, shiftCommitItem } from './commitQueue'
import { preCommitFunctor, getPreCommit } from './preComit'
import { isFn, trampoline, consoleFunc } from '../utils'
import { getParentNode } from './getParentNode'

import { Either, Left, Right } from '../functor'

let preCommit = null
let WIP = null

const updateHost = WIP => {
  return WIP
}

const updateHook = (WIP) => {
  return WIP
}

export const reconcile = compose(
  Either(
    compose(WIP => {
      // trampoline tail recurse how to work ???
      // const reconcileLoop = compose((WIP) => WIP)
      // WIP = trampoline(curry(reconcileLoop)(WIP))()
      return WIP
    }),
    compose(WIP => WIP),
  ),
  (WIP) => {
    WIP.parentNode = getParentNode(WIP)
    isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
    WIP.dirty = WIP.dirty ? false : 0
    WIP.oldProps = WIP.props
    // 这里就push吗，不太理解
    console.log('push213')
    // commitItems 这里push了多次，有问题
    pushCommitItem(WIP)
    return WIP.child ? Right.of(WIP.child) : Left.of(WIP)
  },
)

export const reconcileWorkLoop = compose(
  Either(
    compose(
      // () => WIP || null
      (WIP) => WIP,
    ),
    compose(
      // reconcile
      // () => function
      (WIP) => reconcile(WIP),
    ),
  ),
  (didout, WIP) => {
    // some problem
    const goonWork = !shouldYield() || didout
    console.log('goonWork && WIP', goonWork , WIP, shouldYield())
    return (goonWork && WIP) ? Right.of(WIP) : Left.of(WIP)
  },
)

// const reconcileBase = curry()

// reconcileWork :: didout -> ( () => {}|null )
// reconcileWork finishe
export const reconcileWork = compose(
  Either(
    compose(
      () => {
        console.log('end')
        if(preCommit) pushUpdateItem(preCommit)
        return null
      }
    ),
    compose(rcWorkFunc => rcWorkFunc), // so we return a function
  ),
  ({ didout, newWIP }) => {
    const notOut = !didout // current WIP not out, so can be processed in next reconcileLoop(reconcile stream)
    // console.log('newWIP',newWIP, notOut, notOut && newWIP)
    // console.log((!notOut && newWIP))// ?? not sure
    console.log('notOut && newWIP', notOut && newWIP)
    return (notOut && newWIP) ? Right.of(reconcileWork) : Left.of(null)
  },
  (didout) => {
    if (!WIP) WIP = shiftUpdateItem()._value
    // 到这里没有问题，因为还没有处理到WIP
    // 实际上需要reconcileWorkLoop来处理wip，但是reconcileWorkLoop暂时还没对WIP进行处理
    const newWIP = trampoline(curry(reconcileWorkLoop)(didout))(WIP)
    return { didout, newWIP }
  },
)