import * as R from 'ramda'
import { Functor } from '../functor'
import { consoleFunc } from '../utils'

const { compose, curry, map, ap } = R

export const preCommitFunctor = Functor.of(12)

export const getPreCommit = map(commit => commit)(preCommitFunctor)

// export const setPreCommit = map
