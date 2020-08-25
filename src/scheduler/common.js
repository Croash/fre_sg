import * as R from 'ramda'
import { Functor } from '../functor'

const { map } = R

const getTime = () => performance.now()

const frameLength = 1000 / 60

let deadlineFunctor = Functor.of({ time: 0 })
// updateDeadline :: () -> Functor
const updateDeadline = () => map((a) => Object.assign(a, {
  time: getTime() + frameLength
}))(deadlineFunctor)


function shouldYield() {
  return getTime() >= deadlineFunctor._value.time//frameDeadline
}

export {
  getTime,
  frameLength,
  updateDeadline,
  shouldYield,
}

