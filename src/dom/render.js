// import { Functor } from '../functor'
import { createElement } from './dom'

function renderMock(vnode, node, done) {
  // 到这里是没有问题的
  // 这里其实做的事情，是将app对应的函数，整体insert到#app这个dom上，剩余的应该由reconcile等部分来做。
  // 这里做的是没有问题的
  const rootFiber = {
    node,
    props: {
      children: vnode
    },
    done
  }
  console.log(rootFiber, 'rootFiber')
  let child
  if (rootFiber.type instanceof Function) {
    child = rootFiber.type(rootFiber.props)
    console.log(child)
  }
  const mockDom = createElement(rootFiber)
  console.log('mock', mockDom)
  node.insertBefore(null, mockDom)
}

export {
  renderMock as render,
}
