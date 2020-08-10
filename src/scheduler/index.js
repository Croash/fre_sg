import * as R from 'ramda'
import { push, pop, peek } from '../utils/heapify'
import { Functor, Maybe, Either } from '../functor'
import { frameLength ,getTime, shouldYield } from './common'
import Task from 'fun-task'

const { compose, curry, map, ap, prop, chain } = R

const taskQueue = []
// scheduleCallback => planWork[flushWork[flush]]

const taskQueueFunctor = Functor.of([])
// :: pushTaskBase ft -> ( ft -> ft )
const pushTaskBase = map(curry(push))(taskQueueFunctor)
// ::pushTask  ( -> ) -> taskqFunctor
const pushTask = compose(
  ap(pushTaskBase),
  (cb) => Functor.of({ callback: cb, startTime: getTime(), dueTime: getTime() + 300})
)
// 
window.pushTask = pushTask
window.Task = Task


let deadlineFunctor = Functor.of({ time: 0 })
// :: updateDeadline () -> Functor
const updateDeadline = () => map((a) => Object.assign(a, {
  time: getTime() + frameLength
}))(deadlineFunctor)
window.updateDeadline = updateDeadline
// const addFrameLength = 


const planWorkTask = f => Task.create((onSuccess, onFailure) => {
  const timeout = setTimeout(f)
  return () => {
    clearTimeout(timeout)
  }
})

/** 
 * ::fTest cb -> 
 * const fTest = compose( ,map(cb => (cb && cb(getTime)) ? cb || null),Maybe.of )
 *   
 *
 * 
 * 
 */

// const scCallback = compose(planWork, pushTask) // 存疑

// 今天到此位置 好难啊



export function scheduleCallback(callback) {
  const startTime = getTime()

  const newTask = {
    callback,
    startTime,
    dueTime: startTime + 300
  }

  push(taskQueue, newTask)
  // currentCallback = flush
  // planWork()
}


// show on window
window.Maybe = Maybe
window.Either = Either
