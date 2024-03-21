综上所述，scheduler 伪代码如下

``` js
const planWork = setTimeOut // 用于下一帧执行
```

```js
const flushWork = cb => { // 当有task时，循环执行至任务处理完
  const t = Performance.now()
  if (cb(t)) {
    planWork(flushWork(cb))
  }
}
```

```js
taskQueue // 一个以dueTime排序的task的堆
cosnt flushBase = currentTask => {
  if (can execute currentTask) {
    execute
    taskQueue.pop()
    if (taskQueue.peek()) {
      flushBase(taskQueue.peek())
    } else {
      return false
    }
  } else {
    return !!currentTask
  }
}
```

```js
// 实际外部使用函数
const scheduleCallback = callback => {
  taskQueue.push(callback)
  const cb = () => {
    const task = taskQueue.peek()
    const r = flushBase(task._value)
    return !!r
  }
  planWork(
    flushWork(cb)
  )
}
scheduleCallback(() => { console.log('schedulerCallBack executed') })
```
