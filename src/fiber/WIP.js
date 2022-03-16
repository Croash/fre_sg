import * as R from 'ramda'
import { Functor } from '../functor'
import { consoleFunc } from '../utils'

const { compose, curry, map, ap, prop } = R

// functor
const WIPFunctor = Functor.of({ WIP: null })

// update
const updateBase = map(
  curry((obj, v) => {
    Object.assign(obj, { WIP: v })
    return obj
  }),
)(WIPFunctor)

export const updateWIP = compose(
  ap(updateBase),
  (WIP) => Functor.of(WIP),
)

// getWIP
export const getWIP = () => compose(
  prop('WIP'),
  prop('_value'),
)(WIPFunctor)
