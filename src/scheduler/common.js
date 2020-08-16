import { Functor } from '../functor'

export const getTime = () => performance.now()

export function shouldYield() {
  return getTime() >= deadlineFunctor._value.time//frameDeadline
}

let deadlineFunctor = Functor.of({ time: 0 })
// updateDeadline :: () -> Functor
export const updateDeadline = () => map((a) => Object.assign(a, {
  time: getTime() + frameLength
}))(deadlineFunctor)

export const frameLength = 1000 / 60
