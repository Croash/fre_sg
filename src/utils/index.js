import { trampoline } from './sc'

// util function
const isFn = fn => typeof fn === 'function'

export {
  isFn,
  trampoline
}
