import * as R from 'ramda'
import { push, pop, peek } from '../utils/heapify'
import { Functor, Maybe, Either } from '../functor'
import { frameLength ,getTime, shouldYield } from './common'
import { planWork } from './planwork'
import Task from 'fun-task'

const { compose, curry, map, ap, prop, chain } = R

const taskQueue = []
// scheduleCallback => planWork[flushWork[flush]]

const taskQueueFunctor = Functor.of([])
// pushTaskBase:: ft -> ( ft -> ft )
const pushTaskBase = map(curry(push))(taskQueueFunctor)
// pushTask::  ( -> ) -> taskqFunctor
const pushTask = compose(
  ap(pushTaskBase),
  (cb) => Functor.of({ callback: cb, startTime: getTime(), dueTime: getTime() + 300})
)

window.taskQueueFunctor = taskQueueFunctor

export { taskQueueFunctor }

export const peekTask = () => map(peek)(taskQueueFunctor)

export const popTask = () => map(pop)(taskQueueFunctor)

// window.pushTask = pushTask

window.prop = prop
window.popTask = popTask

window.peekTask = peekTask

// 
window.pushTask = pushTask
window.Task = Task

// const addFrameLength = 

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

// todo flush
// tail recurse and finish scheduler ! so xx hapi!

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
