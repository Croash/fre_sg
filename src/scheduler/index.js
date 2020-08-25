import * as R from 'ramda'
// import { push, pop, peek } from '../utils/heapify'
// import { Functor, Maybe, Either } from '../functor'
import { frameLength ,getTime, shouldYield } from './common'
import { pushTask, popTask, peekTask } from './taskQueue'
import { flushWork, planWork, flushBase } from './planwork'

const { compose, curry, map, ap } = R


// scheduleCallback:: callback => void
const scheduleCallback = (callback) => {
  pushTask(callback)
  planWork(
    () => flushBase(
      peekTask()._value
    )
  )
}

window.scheduleCallback = scheduleCallback

export {
  planWork,
  scheduleCallback,
  shouldYield
}
