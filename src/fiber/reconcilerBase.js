import { compose, curry, map, prop } from 'ramda'
import { scheduleCallback, shouldYield } from '../scheduler'
import { getTime } from '../scheduler/common'
import { pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { pushCommitItem, shiftCommitItem } from './commitQueue'
import { isFn, trampoline, consoleFunc } from '../utils'
import { getParentNode } from './getParentNode'

import { Either, Left, Right } from '../functor'

let preCommit = null

export const reconcileLoopBase = compose(
  (a, WIP) => {
    console.log(a, WIP)
    return WIP
  }
)

// const reconcileBase = curry()

// reconcileWork :: didout -> ( () => {}|null )
export const reconcileWork = compose(
  Either(
    compose(
      () => {
        preCommit && true // commit(preCommit)
        return null
      }
    ),
    compose(rcWork => rcWork)
  ),
  ({ didout, newWIP }) => {
    console.log('fs123',!didout , newWIP)
    return (!didout && newWIP) ? Right.of(reconcileWork) : Left.of(null)
  },
  (didout) => {
    const WIP = shiftUpdateItem()._value
    // trampoline change to closure
    const newWIP = trampoline(curry(reconcileLoopBase)(didout))(WIP)
    return { didout, newWIP }
  },
  consoleFunc('didoutM'),
)