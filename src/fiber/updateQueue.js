import * as R from 'ramda'
import { consoleFunc } from '../utils'
import { Functor } from 'sg_func'

const { compose, curry, map, ap, prop } = R

const updateQueueFunctor = Functor.of([])

const pushBase = map(
  curry(
    (queue, item) => {
      queue.push(item);
      return queue
    }
  )
)(updateQueueFunctor)

// const shiftBase = queue => queue.shift()

const pushUpdateItem = compose(
  ap(pushBase),
  (fiberItem) => Functor.of(fiberItem)
)

// ap
const shiftUpdateItem = () => 
  // prop('_value'),
  map(queue => queue.shift())(updateQueueFunctor)


export {
  updateQueueFunctor,
  pushUpdateItem,
  shiftUpdateItem
}
