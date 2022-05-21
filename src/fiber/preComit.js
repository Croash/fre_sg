import * as R from 'ramda'
import { Functor } from 'sg_func'
import { consoleFunc } from '../utils'

const { compose, curry, map, ap } = R

export const preCommitFunctor = Functor.of(null)

export const getPreCommit = map(commit => commit)(preCommitFunctor)

// export const setPreCommit = map
