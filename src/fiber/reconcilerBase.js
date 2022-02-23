import { compose, curry, map, prop } from 'ramda'
import { scheduleCallback, shouldYield } from '../scheduler'
import { getTime } from '../scheduler/common'
import { pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { pushCommitItem, shiftCommitItem } from './commitQueue'
import { isFn, trampoline, consoleFunc } from '../utils'
import { getParentNode } from './getParentNode'

import { Either, Left, Right } from '../functor'

let preCommit = null
let WIP = null

const updateHook = (WIP) => {
  console.log('WIP_CHILDREN', WIP)
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
    isFn(WIP.type) ? updateHOOK(WIP) : updateHOOK(WIP)
    WIP.dirty = WIP.dirty ? false : 0
    WIP.oldProps = WIP.props
    // 这里就push吗，不太理解
    pushCommitItem(WIP)
    return WIP.child ? Right.of(WIP.child) : Left.of(WIP)
  }
)

export const reconcileWorkLoop = compose(
  Either(
    compose(
      (WIP) => WIP,
    ),
    compose(
      consoleFunc('rightFunc'),
      // reconcile
      (WIP) => WIP,
    ),
  ),
  ( didout, WIP ) => {
    const goonWork = !shouldYield() || didout
    console.log('didout, WIP ', didout, WIP )
    return (goonWork && WIP) ? Right.of(WIP) : Left.of(WIP)
  },
)

// const reconcileBase = curry()

// reconcileWork :: didout -> ( () => {}|null )
export const reconcileWork = compose(
  Either(
    compose(
      () => {
        if(preCommit) pushUpdateItem(preCommit)
        return null
      }
    ),
    compose(rcWork => rcWork)
  ),
  ({ didout, newWIP }) => {
    const notOut = shouldYield() || didout
    console.log((!notOut && newWIP))// ?? not sure
    return (!notOut && newWIP) ? Right.of(reconcileWork) : Left.of(null)
  },
  (didout) => {
    if(!WIP) WIP = shiftUpdateItem()._value
    const newWIP = trampoline(curry(reconcileWorkLoop)(didout))(WIP)
    return { didout, newWIP }
  },
  consoleFunc('didoutM'),
)