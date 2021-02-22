import * as R from 'ramda'
import { Either, Left, Right } from '../functor'
import { getTime, shouldYield, updateDeadline, timeFunctor } from './common'
import { peekTask, popTask, taskQueueFunctor } from './taskQueue'

const { compose, prop } = R

// getTime 有问题，应该修改成传入而非使用getTime
// flushWork:: callBack => void
// todo currentTask => 
const flushWork = (cb) => {
  const t = getTime()
  // t要更新的，这个是用来做当前帧起始时间用的，要是把getTime放入flushBase来获取initTime
  // 会有问题，帧initTime直接变成了动态的，这一帧一辈子都结束不了了。更新deadlineTime
  updateDeadline(t)
  if(cb && cb(t)) {
    // 因为用了settimeout，是否使用IO????
    // 不使用task了，直接使用两个函数互相调用递归，来保证时间的正确性
    planWork(() => flushWork(cb))
  }
}

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

// let f = () => {
//   var mem = 1
//   return () => {
//     console.log('mem:', mem)
//     mem < 3 && mem ++
//     return mem<3
//   }
// }

/**
 * const newFunc = f()
 * 
 * flushWork(f())
 * 
 * 这样，flushwork 可以保证每一个planwork启动后，触发结束cb然后做判断再继续planwork
 * 
 */

// const taskCheck = 

// const taskCheckBase = curry(taskCheck)
// tb:: currentTask -> Right||Left
// const tb = 

const consoleFunc = (functor) => {
  console.log(functor)
  return functor
}

/**
 * 思考一下，这里写错了，不应该这么循环
 * 
 */
// 需要之后重构一下

// flushBase:: currentTask -> boolean
const flushBase = compose(
  Either(
    compose(
      t => !!t,
      prop('currentTask'),
      prop('_value')
    ),
    // 循环写错了
    compose(
      Either(
        (nil) => { console.log('nilTask:', nil) },
        (v) => flushBase(v),
      ),
      // 这里错了 出不去了
      // Either(
        // compose(
          // prop('currentTask'),
          // (v) => { console.log('v', v); return v }
        // ),
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
    const didout =  currentTask.dueTime <= initTime  // initTime
    return currentTask && (didout || !shouldYield()) ? Right.of({ didout, currentTask }) : Left.of({ currentTask })
  },
  (currentTask) => {
    // r or left
    const initTime = timeFunctor._value.initTime
    // console.log(currentTask)
    return { initTime, currentTask }
    // return currentTask ? Right.of({ initTime, currentTask }) : Left.of({ currentTask })
  }
)

export {
  flushBase,
  flushWork,
  planWork
}
