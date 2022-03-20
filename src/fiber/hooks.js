import { scheduleWork } from './reconciler'
import { isFn } from '../utils'
import { getCurrentFiber } from './reconcilerBase'
// cursor 用来挂钩子的，相当于currentHook 的id
let cursor = 0
// gethook相当于注册hook，
// 每次执行完hook都会重新注册一遍，执行，然后清空cursor
export function getHook(cursor) {
  const current = getCurrentFiber()
  let hooks =
    current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    // 不明所以
    hooks.list.push([])
  }
  // 所有人的hooks是公用的，唯一有意义的就是
  return [hooks.list[cursor], current]
}

export function isChanged(a, b) {
  return !a || b.some((arg, index) => arg !== a[index])
}

export function resetCursor() {
  cursor = 0
}

export function useState(initState) {
  return useReducer(null, initState)
}

export function useReducer(reducer, initState) {
  const [hook, current] = getHook(cursor++)
  const setter = value => {
    let newValue = reducer
      ? reducer(hook[0], value)
      : isFn(value)
      ? value(hook[0])
      : value
    if (newValue !== hook[0]) {
      hook[0] = newValue
      scheduleWork(current)
    }
  }

  if (hook.length) {
    return [hook[0], setter]
  } else {
    hook[0] = initState
    return [initState, setter]
  }
}