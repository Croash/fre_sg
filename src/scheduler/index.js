import * as R from 'ramda'
import { push, pop, peek } from '../utils/heapify'
import { Functor } from '../functor'
const { compose, curry, map, ap } = R

const taskQueue = []
let currentCallback = null
let frameDeadline = 0
const frameLength = 1000 / 60

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

const scCallback = compose(planWork, pushTask) // 存疑

// 今天到此位置 好难啊

export const planWork = cb => setTimeout(cb)

export function scheduleCallback(callback) {
  const startTime = getTime()

  const newTask = {
    callback,
    startTime,
    dueTime: startTime + 300
  }

  push(taskQueue, newTask)
  // currentCallback = flush
  planWork()
}

export const getTime = () => performance.now()
console.log(getTime(), getTime())
export function shouldYield() {
  return getTime() >= frameDeadline
}