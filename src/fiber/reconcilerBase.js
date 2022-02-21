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
export const reconcileWork = compose(
  (didout) => {
    const WIP = shiftUpdateItem()._value
    console.log('cf', WIP)
    // trampoline change to closure
    return trampoline(curry(reconcileLoopBase)(didout))(WIP)
  },
  consoleFunc('didoutM'),
)