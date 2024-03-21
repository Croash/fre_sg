import * as R from 'ramda'
// import { push, pop, peek } from '../utils/heapify'
// import { Functor, Maybe, Either } from '../functor'
import { shouldYield, getTime } from './common'
import { pushTask, popTask, peekTask, taskQueueFunctor } from './taskQueue'
import { flushWork, planWork, flushBase } from './planwork'

// scheduleCallback:: callback => void
const scheduleCallback = (callback) => {
  // 1.将callback放到堆顶
  pushTask(callback)
  const cb = (t) => {
    // 2. 执行堆顶的函数
    const r = flushBase(
      peekTask()._value
    )
    // 3. return 堆顶是否还有callback，true则会继续执行下去，反之不会
    // 详情看flushWork的cb(t)
    return !!peekTask()._value
  }
  // 4. 触发scheduler，开始处理scheduler中的函数
  planWork(
    () => flushWork(cb)
  )
}

export {
  planWork,
  getTime,
  scheduleCallback,
  shouldYield
}
