import { curry } from 'ramda'
import { trampoline } from './sc'

// util function
const isFn = fn => typeof fn === 'function'

const consoleFunc = curry((label, ins) => {
  console.log(`console.log:${label}`, ins);
  return ins
})

export {
  isFn,
  trampoline,
  consoleFunc
}
