import * as R from 'ramda'
import { push, pop, peek } from '../utils/heapify'
import { Functor } from '../functor'

const { compose, curry, map } = R

// const global = {
//   taskQueue: [],
//   currentCallback: null,
//   frameDeadline: 0,
//   frameLength: 1000/60
// }

const taskQueue = []
let currentCallback = null
let frameDeadline = 0
const frameLength = 1000 / 60

// scheduleCallback => planWork[flushWork[flush]]

let taskQueueFunctor = Functor.of([])
window.taskQueueFunctor = taskQueueFunctor
window.push = push
window.curry = curry

const pushHeap = map(push)
// push(tQ._value, {})
// map()
const pushTaskBase = map(curry(push))(taskQueueFunctor)
const task = Functor.of({})

window.task = task
window.pushTaskBase = pushTaskBase

// task.map(pushTaskBase._value)

const pushTask = compose(
  taskQueueFunctor,
  (cb) => ({ callback: cb, startTime: getTime(), dueTime: getTime() + 300})
)

const scCallback = compose(planWork, pushTask) // 存疑

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
  planWork()
}

export const getTime = () => performance.now()

export function shouldYield() {
  return getTime() >= frameDeadline
}

const planWork = () => {

}