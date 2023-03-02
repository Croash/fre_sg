### main
可以分成三层，taskManager(用来处理task)；fiber(单独处理fiber和推入taskManager两种处理方式)；dom，

### 1. taskManager

taskManager是用来处理task的。作为fre的底层，原理很简单。
推入task时，初始化task。之后对比时间，已超时或还在当前帧可用时间内，则处理task，然后pop出来。否则则继续等下一帧，task继续前一步的执行。直到taskQueue为空或者推入新的task为止。

虽然原理简单，实现起来还是有点麻烦的。需要两层递归叠在一起，还有一个是两个函数互相调用的递归，实在是。。。（主要是抄代码的时候没有细想还有没有好的处理方式）。

可以暴露出来 planWork, scheduleWork， shouldYield三个api。
planWork其实和taskManager无关，可以认为类似setTimeout的函数。
scheduleWork是核心，推入callback，帮你处理成task然后在taskManager中执行。
shouldYield? 时间相关的。

### 2. reconciler

reconciler是用来处理fiber的。
reconciler真正重要的是两个部分，将各个fiber与它的child，parent，sibling链接起来和从头到底进行遍历两个方面。
所以比较合理的，是先将网编好（其实是一个队列），然后再对着队列遍历（虽然理论上是队列，但是实际处理还是根据parent，sibling，child来进行判断递归的，不过执行上没有问题）。

### 3. hooks

1. hooks 相当于一个数据的单独缓存，当有useState的时候，会顺序在hooks对象中放入缓存值和更新函数。如果更新函数执行，则缓存值进行更新，之后走fiber的路径，更新fiber，更新视图。
2. 每一个fc comp都会有一个hooks，如果组件销毁，hooks则被释放。
```js
impprt { useState } from '??'

const Comp = () => {
  const [num, setNum] = useState(0)
  return <div>{num}</div>
}

const App = () => {
  const [vis, setVis] = useState(false)
  return vis ? <Comp /> : null
}
```
类似于上文，如果App对应fiber所绑定的hooks，存储了 [vis, setVis]的hook，而Comp则存储[num, setNum]的hook。当vis为false，Comp的fiber会被gc掉，hook同理。vis再次被置为true时，新Comp的fiber再次被创建。


### todo

1. 将createElement和updateElement剥离出来
2. 将render，h和dom相关方法联系起来，并且进行测试
3. 最后在处理reconcile的相关流程，并测试
4. 将scheduler中的递归，用transpolie（balabala...）替换，防止站爆了


5. 统一使用functional的方式处理
6. 分多个库
7. 写测试
8. useState，useEffect...
9. logo！（再说）