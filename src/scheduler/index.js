import * as R from 'ramda'
// import { push, pop, peek } from '../utils/heapify'
// import { Functor, Maybe, Either } from '../functor'
import { frameLength ,getTime, shouldYield } from './common'
import { pushTask, popTask, peekTask } from './taskQueue'
import { flushWork, planWork, flushBase } from './planwork'

const { compose, curry, map, ap } = R


// scheduleCallback:: 
const scheduleCallback = (callback) => {
  pushTask(callback)
  pushTask(()=>{console.log('test1')})
  pushTask(()=>{console.log('test2')})
  pushTask(()=>{console.log('test3')})
  planWork(() => flushBase(
    // ()=>{console.log('pop')}
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
