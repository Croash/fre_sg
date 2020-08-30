import * as R from 'ramda'
import { Functor } from '../functor'

const { map } = R

const getTime = () => performance.now()

const frameLength = 1000 / 60

let timeFunctor = Functor.of({ time: 0, initTime: 0 })
// updateDeadline :: () -> Functor
const updateDeadline = () => map(
  (a) => {
    const t = getTime()
    Object.assign(a, {
      time: t + frameLength,
      initTime: t
    })
  }
)(timeFunctor)


function shouldYield() {
  const t = getTime()
  // console.log(t, timeFunctor._value.time)
  return t >= timeFunctor._value.time//frameDeadline
}

export {
  getTime,
  timeFunctor,
  frameLength,
  updateDeadline,
  shouldYield,
}

