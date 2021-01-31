import * as R from 'ramda'
import { push, pop, peek } from '../utils/heapify'
import { Functor, Maybe, Either } from '../functor'
import { frameLength ,getTime, shouldYield } from './common'

const { compose, curry, map, ap, prop, chain } = R

const taskQueue = []
// scheduleCallback => planWork[flushWork[flush]]

const taskQueueFunctor = Functor.of([])
// pushTaskBase:: ft -> ( ft -> ft )
const pushTaskBase = map(curry(push))(taskQueueFunctor)
// pushTask::  ( -> ) -> taskqFunctor
const pushTask = compose(
  ap(pushTaskBase),
  (cb) => Functor.of({ callback: cb, startTime: getTime(), dueTime: getTime() + 300}),
)
const peekTask = () => map(peek)(taskQueueFunctor)
const popTask = () => map(pop)(taskQueueFunctor)

export {
  pushTask,
  peekTask,
  popTask,
  taskQueueFunctor
}
