### scheduler

scheduler 是一个 taskManager（任务调度的工具） 。
scheduler 可以分为三个部分, planWork, flushWork, flushBase。

### planWork

planWork 单纯是一个启动任务消费的函数。

```js
import { flushWork, planWork } from "../index";
const cb = () => console.log("test123");
planWork(() => flushWork(cb));
```

这样的，planWork 就可以直接执行任意函数（和 settimeout 类似）

### flushWork

flushWork 暂不管

### flushBase

这个是核心函数。
执行内容主要分两步

1. 输入堆顶的 task，如果 task 过期（也就是任务截止时间超过当前时间），或者在允许执行 task 的时间段内，我们就继续执行。否则，直接跳出该循环。
2. 因为执行的 task 中的 callback，callback() 可以继续有值（想一下，fiber 执行完 root 的 state 之后，children 仍然有 state 未处理完，而整个 root 包括 children 执行完，才算这个 fiber 的 state 计算完），有值的话，就会把 curTask.callback 做一个更新。
   之后会看堆顶是否还有 task，有的话，flushBase(popTask())。否则，跳出循环。

### 三者的组合

三者的组合很简单

```js
const scheduleCallback = (callback) => {
  pushTask(callback);
  planWork(() => {
    flushWork(() => {
      flushBase(peek());
      return !!peek();
    });
  });
};
// scheduleCallback(() => { console.log(123) })
```

这样通过 planWork 来启动，flushBase 来不停的消费任务堆，直到堆清空。我们的 scheduler 也就完成了。
