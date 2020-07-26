import * as R from 'ramda'
import { push, pop, peek } from '../utils/heapify'

const {} = R

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