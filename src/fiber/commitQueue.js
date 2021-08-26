import * as R from 'ramda'
import { Functor } from '../functor'
import { consoleFunc } from '../utils'

const { compose, curry, map, ap } = R

const commitQueueFunctor = Functor.of([])

const pushBase = map(
  curry(
    (queue, item) => {
      queue.push(item)
      return queue
    },
  )
)(commitQueueFunctor)

// pushCommitItem: fiber -> commitQueueFunctor
const pushCommitItem = compose(
  // consoleFunc('go'),
  ap(pushBase),
  // consoleFunc('item'),
  (fiberItem) => Functor.of(fiberItem),
)

const shiftCommitItem = map(queue => queue.shift())(commitQueueFunctor)

export {
  commitQueueFunctor,
  pushCommitItem,
  shiftCommitItem
}
