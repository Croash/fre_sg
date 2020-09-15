import * as R from 'ramda'
import { Functor } from '../functor'

const { compose, curry, map, ap } = R

const updateQueueFunctor = Functor.of([])

const pushBase = (
  curry(
    (queue, item) => queue.push(item)
  )
)(updateQueueFunctor)

const popBase = queue => queue.pop()

const pushUpdateItem = compose(
  ap(pushBase),
  (fiberItem) => Functor.of(fiberItem)
)

const popUpdateItem = map(popBase)(updateQueueFunctor)

export {
  updateQueueFunctor,
  pushUpdateItem,
  popUpdateItem
}
