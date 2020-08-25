import * as R from 'ramda'
// import { push, pop, peek } from '../utils/heapify'
// import { Functor, Maybe, Either } from '../functor'
import { shouldYield } from './common'
import { pushTask, popTask, peekTask } from './taskQueue'
import { flushWork, planWork, flushBase } from './planwork'

const { compose, curry, map, ap } = R

// scheduleCallback:: callback => void
const scheduleCallback = (callback) => {
  pushTask(callback)
  pushTask(() => {
    console.log('test1')
  })
  pushTask(() => {
    console.log('test2')
  })
  pushTask(() => {
    console.log('test3')
  })
  pushTask(() => {
    console.log('test4')
  })
  pushTask(() => {
    console.log('test5')
  })
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
