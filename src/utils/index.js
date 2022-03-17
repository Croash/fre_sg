import { curry } from 'ramda'
import { trampoline } from './sc'

// util function
const isFn = fn => typeof fn === 'function'
const isStr = s => typeof s === 'string' || typeof s === 'number'
const consoleFunc = curry((label, ins) => {
  console.log(`console.log:${label}`, ins);
  return ins
})

export const isArr = Array.isArray

export {
  isFn,
  isStr,
  trampoline,
  consoleFunc
}
