import { curry } from 'ramda'
import { trampoline } from './sc'

// util function
const isFn = fn => typeof fn === 'function'

const consoleFunc = curry((label, ins) => {
  console.log(`console.log:${label}`, ins);
  return ins
})

export const isArr = Array.isArray

export {
  isFn,
  trampoline,
  consoleFunc
}
