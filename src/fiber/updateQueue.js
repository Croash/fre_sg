import * as R from 'ramda'
import { Functor } from '../functor'

const { compose, curry, map, ap } = R

const updateQueueFunctor = Functor.of([])

const pushBase = map(
  curry(
    (queue, item) => queue.push(item)
  )
)(updateQueueFunctor)

// const shiftBase = queue => queue.shift()

const pushUpdateItem = compose(
  ap(pushBase),
  (fiberItem) => Functor.of(fiberItem)
)

const shiftUpdateItem = () => map(queue => queue.shift())(updateQueueFunctor)

export {
  updateQueueFunctor,
  pushUpdateItem,
  shiftUpdateItem
}
