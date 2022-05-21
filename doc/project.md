# fre_sg

fre_sg 的 scheduler 已经剥离为了单独的 lib，scheduler_sg，一个调度器，有任务时，会在渲染间隙完成任务，同时任务超时的时候，会优先处理任务。

## 代码部分

只看 fiber 的部分.

```js
import { scheduleCallback } from "scheduleCallback_sg";
```

reconciler.js 中的 render 方法，其实是整个 fiber 渲染的入口，之后将 jsx 中的组件通过 h 方法(对应 react.createElement)将组件转化为一个个的 fiber。
并将该 fiber 做一个标记，是从该 fiber 开始渲染（或者有改变），之后 sibling，children，parent 回来时，该标记触发 commit，进入 commit 和之后的 dom 节点替换阶段。
之后将 fiber 推入 updateQueue 中，scheduleCallback 调用 reconcileWork，正式开始处理 fiber。

### reconcileWork

reconcileWork 做的，其实就是判断 updateQueue 中的 item 是否在当前帧进行处理。
无 item 时，不执行，因为相当于所有 item 都已经清理完。
如果该任务未超时，且还有 item，那么就继续执行。
如果该任务未超时，但是该帧应当渲染，则该 item 不执行处理，渲染结束再做处理。
而如果超时，则强制先处理完该任务，在做后续的执行。

### reconcileWorkLoop

reconcileWork 中有执行到 reconcileWorkLoop。在允许执行当前 fiber 的情况下，reconcileWorkLoop 会通过 reconcile 来将 wip(wip 在这里即为当前处理的 fiber)与其父和 children 的关系来做好确定。

### reconcile

reconcile 的调用是一个循环，会调用到超时或者没有 fiber 需要处理为止。
reconcile 会将 currentFiber 的 type 进行判断，如果为 function，则进行 updateHook，否则就 updateHost（直接 update 节点了）。

如果是 updateHook，则会找到其 parentNode，之后会对其 parentNode 进行处理（dom 操作，添加删除等操作）。
如果是 updateHost，会根据是否有 node 来为其添加 node 属性。

二者之后都会调用 reconcileChildren 来构建 currentFiber 和其 children 的关系，当循环回 curFiber（存疑） 时，该函数即结束。
reconcileChildren 相当于是构建了 parent,sibling,children 的关系（没有用到 return）。
之后通过循环，所有的 fiber 的关系也就关联起来了。
