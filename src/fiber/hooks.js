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
  // 这里的操作其实是这样的，首先将hook[0]的值更新
  // 之后hook那边 useState产生的值其实也就更新了
  // 然后fiber也就同步更新了，调用scheduleWork从而开始新的fiber到dom的更新
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
    // 相当于我会新提供一个[val, setter], val 是新的，只要我的hook[0]有更新，那么h产生的fiber就会更新，然后
    // scheduleWork之后才会进行更新，我理解是这样的
    // 当然 他是如何保证先return下方结果，再进行scheduleWork的呢？
    // 这个比较好奇，剩余的流程，我都明白了
    // 之后整理文档
    return [hook[0], setter]
  } else {
    hook[0] = initState
    return [initState, setter]
  }
}

export function useEffect(cb, deps) {
  return effectImpl(cb, deps, 'effect')
}

export function useLayout(cb, deps) {
  return effectImpl(cb, deps, 'layout')
}

function effectImpl(cb, deps, key) {
  let [hook, current] = getHook(cursor++)
  if (isChanged(hook[1], deps)) {
    hook[0] = useCallback(cb, deps)
    hook[1] = deps
    current.hooks[key].push(hook)
  }
}

export function useMemo(cb, deps) {
  let hook = getHook(cursor++)[0]
  if (isChanged(hook[1], deps)) {
    hook[1] = deps
    return (hook[0] = cb())
  }
  return hook[0]
}

export function useCallback(cb, deps) {
  return useMemo(() => cb, deps)
}

export function useRef(current) {
  return useMemo(() => ({ current }), [])
}

export function getHook(cursor) {
  const current = getCurrentFiber()
  let hooks =
    current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([])
  }
  return [hooks.list[cursor], current]
}

