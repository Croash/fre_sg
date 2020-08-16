import * as R from 'ramda'
import { Either, Left, Right } from '../functor'
// import { shouldYield } from './common'
import { getTime, shouldYield } from './common'
import { peekTask, popTask } from './index'

const { curry, compose, map, prop } = R

// getTime 有问题，应该修改成传入而非使用getTime
export const flushWork = (cb) => {
  console.log(cb)
  if(cb && cb(getTime())) {
    // 因为用了settimeout，是否使用IO????
    // 不使用task了，直接使用两个函数互相调用递归，来保证时间的正确性
    planWork(() => flushWork(cb))
  }
}

// ok 就这样配合一下就好了，之后不需要添加
// planwork 其实是板机，启动后续程序用的
export const planWork = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = flushWork
    return cb => (cb ? requestAnimationFrame(cb) : port2.postMessage(null))
  }
  return cb => setTimeout(cb || flushWork)
})()

let f = () => {
  var mem = 1
  return () => {
    mem < 3 && mem ++
    return mem<3
  }
}

// const taskCheck = 

// const taskCheckBase = curry(taskCheck)
// tb:: currentTask -> Right||Left
// const tb = 

const consoleFunc = (functor) => {
  console.log(functor)
  return functor
}

// 
const flushBase = compose(
  // flushBase,
  // (v) => flushBase(v),
  consoleFunc,
  Either(
    // ({ currentTask }) => !!currentTask,
    compose(t => !!t, prop('currentTask'), prop('_value')),
    compose(
      (v) => flushBase(v),
      // consoleFunc,

      Either(
        v => prop('currentTask')(v),
        compose(
          ({ didout, currentTask }) => {
          const next = currentTask.callback(didout)
          next ? (currentTask.callback = next) : popTask()
          return prop('_value')(peekTask())
          },
          prop('_value')
        )
      ), 
      ({ initTime, currentTask }) => {
        console.log({ initTime, currentTask })
        const didout = initTime < currentTask.duetime
        console.log(didout && shouldYield())
        return didout && shouldYield() ? Right.of({ didout, currentTask }) : Left.of({ currentTask: null })
      },
      // prop('_value'),
      // consoleFunc,let func1234 = () => {let testFunct1 =  () => { pushTask(()=>{console.log('123')}); pushTask(()=>{connsole.log('456')}) };testFunct1();flushBase(peekTask()._value)};func1234()
    )
  ),
  (currentTask) => {
    const initTime = getTime()
    // console.log(initTime)
    return currentTask ? Right.of({ initTime, currentTask }) : Left.of({ currentTask })
  }
) // (task)

window.flushBase = flushBase

// const 
/**
 * const newFunc = f()
 * 
 * flushWork(f)
 * 
 * 这样，flushwork 可以保证每一个planwork启动后，触发结束cb然后做判断再继续planwork
 * 
 */