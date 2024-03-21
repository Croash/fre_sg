import * as R from 'ramda'
import { Either, Left, Right } from 'sg_func'
import { getTime, shouldYield, updateDeadline, timeFunctor } from './common'
import { peekTask, popTask, taskQueueFunctor } from './taskQueue'

import { consoleFunc } from '../utils'

const { compose, prop } = R
let initTime = null
// getTime 有问题，应该修改成传入而非使用getTime
// flushWork:: callBack => void
// todo currentTask => 
// flushWork只是用来确定任务的开始时间和当前帧超时时间，并且updateDeadline用的
// 说白了，就是在flushWork这里，做了一个循环调用，保证flushwork一直在清理堆顶的task，cb(t)为true，堆顶不为空，就继续处理
const flushWork = (cb) => {
  const t = getTime()
  // t要更新的，这个是用来做当前帧起始时间用的，要是把getTime放入flushBase来获取initTime
  // 会有问题，帧initTime直接变成了动态的，这一帧一辈子都结束不了了。更新deadlineTime
  updateDeadline(t)
  if (cb && cb(t)) {
    // 不使用task了，直接使用两个函数互相调用递归，来保证时间的正确性
    // 通过planWork来setimeout到下一帧，来保证留出了时间给浏览器渲染
    planWork(() => flushWork(cb))
  }
}
// 注：planWork 约等于 setTimeout，强行走下一帧，留出时间给浏览器渲染
// 而 flushWork(cb) = (cb) => planWork(() => flushWork(cb))，保证了flushWork的循环调用，约等于一个带条件的while

// ok 就这样配合一下就好了，之后不需要添加
// planwork 其实是扳机，启动后续程序用的
// planWork:: callback => void
const planWork = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = flushWork
    return cb => { cb ? requestAnimationFrame(cb) : port2.postMessage(null) }
  }
  return cb => setTimeout(cb || flushWork)
})()
// planWork === cb => setTimeout(cb || flushWork)

// let f = () => {
//   var mem = 1
//   return () => {
//     console.log('mem:', mem)
//     mem < 3 && mem ++
//     return mem<3
//   }
// }

// 需要之后重构一下

// flushBase:: currentTask -> boolean
const flushBase = compose(
  Either(
    compose(
      t => !!t,
      prop('currentTask'),
      prop('_value')
    ),
    compose(
      Either(
        (nil) => { console.log('nilTask:', nil) },
        (v) => flushBase(v),
      ),
      // 非常重要的一步，next不为空时，callback直接做替换，然后继续执行（虽然觉着可以用push和pop来代替，不过，就先这样吧）
      compose(
        ({ didout, currentTask }) => {
          const next = currentTask.callback(didout)
          next ? (currentTask.callback = next) : popTask()
          // peek is null ? either left or right
          const peek = prop('_value')(peekTask())
          return peek ? Right.of(peek) : Left.of(null)
        }
      )
    ), 
  ),
  ({ initTime, currentTask }) => {
    const didout = currentTask.dueTime <= initTime  // initTime
    // console.log('didout', didout, currentTask.dueTime, initTime, )
    return currentTask && (didout || !shouldYield()) ? Right.of({ didout, currentTask }) : Left.of({ currentTask })
  },
  (currentTask) => {
    // r or left
    initTime = initTime ? getTime() : timeFunctor._value.initTime
    return { initTime, currentTask }
    // return currentTask ? Right.of({ initTime, currentTask }) : Left.of({ currentTask })
  },
)

export {
  flushBase,
  flushWork,
  planWork
}
