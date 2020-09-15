import * as R from 'ramda'
import { Functor } from '../functor'

const { compose, curry, map, ap } = R

const commitQueueFunctor = Functor.of([])

const pushBase = (
  curry(
    (queue, item) => queue.push(item)
  )
)(commitQueueFunctor)

const popBase = queue => queue.pop()

const pushCommitItem = compose(
  ap(pushBase),
  (fiberItem) => Functor.of(fiberItem)
)

const popCommitItem = map(popBase)(commitQueueFunctor)

export {
  commitQueueFunctor,
  pushCommitItem,
  popCommitItem
}
