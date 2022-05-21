import { compose, composeP, curry, map, prop } from 'ramda'
import { scheduleCallback, shouldYield, getTime } from 'scheduler_sg'
// import { getTime } from '../scheduler/common'
import { createElement } from '../dom/dom'
import { pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { pushCommitItem, shiftCommitItem } from './commitQueue'
import { preCommitFunctor, getPreCommit } from './preComit'
import { getWIP, updateWIP } from './WIP'
import { isFn, trampoline, consoleFunc } from '../utils'
import { getParentNode } from './getParentNode'
import { shouldPlace, shouldUpdate, cloneChildren } from './utils'
import { hashfy, createFiber } from './fiberUtil'
import { NOWORK, PLACE, UPDATE, DELETE, SVG } from './constant'
import { createText, MEMO, isStr } from '../dom/h'
import { commitWork } from './commit'
import { resetCursor } from './hooks'

import { Either, Left, Right } from 'sg_func'
let preCommit = null
export const clearPreCommit = () => preCommit = null

let currentFiber = null

export const getCurrentFiber = () => currentFiber || null

// reconcileChildren 
// 只将WIP和WIP.children以及相关的sibling
const reconcileChildren = compose(
  Either(
    compose(nil => nil),
    compose(({WIP, children}) => {
      delete WIP.child // *a
      const oldFibers = WIP.kids
      // 这里是如何对应的？？？
      const newFibers = (WIP.kids = hashfy(children))
      const reused = {}
      for (let k in oldFibers) {
        const oldFiber = oldFibers[k]
        const newFiber = newFibers[k]
        if (oldFiber && oldFiber) {
          reused[k] = oldFiber
        } else {
          oldFiber.op = DELETE
          pushCommitItem(oldFiber)
        }
      }
      

      // newfiber处理
      let prevFiber = null
      let alternate = null
      for (const k in newFibers) {
        let newFiber = newFibers[k]
        let oldFiber = reused[k]

        if (oldFiber) {
          alternate = createFiber(oldFiber, UPDATE)
          newFiber.op = UPDATE
          // how to update? not {...newFiber, ...alternate} ??
          newFiber = { ...alternate, ...newFiber }
          newFiber.lastProps = alternate.props
          if (shouldPlace(newFiber)) {
            newFiber.op = PLACE
          }
        } else {
          newFiber = createFiber(newFiber, PLACE)
        }

        newFibers[k] = newFiber
        // 设置parent
        // 忽然明白，其实sibling的设置，不需要关注是否为从上到下或者从左到右，只需要关心是否遍历到就行
        newFiber.parent = WIP

        if (prevFiber) {
          // 设置sibling
          prevFiber.sibling = newFiber
        } else {
          if (WIP.tag === SVG) newFiber.tag = SVG
          // 设置child
          WIP.child = newFiber // newFiber 与 WIP 链接，整体child, sibling 和 paraent的网络就完成了
        }
        prevFiber = newFiber
      }

      // 结束 prevFiber置为null
      if (prevFiber) prevFiber.sibling = null


      return WIP
    }),
  ),
  (WIP, children) => {
    return children ? Right.of({WIP, children}) : Left.of(null)
  }
)

const updateHost = compose(
  (WIP) => {
    // insertPoint ?? 
    // parentNode ??
    // node.last ??
    let p = WIP.parentNode || {}
    WIP.insertPoint = p.last || null
    p.last = WIP
    WIP.node.last = null
    // insertPoint & parentNode are used when commit
    // and node.last ? i think wont use
    reconcileChildren(WIP, WIP.props.children)
    return WIP
  },
  Either(
    compose(WIP => {
      if (WIP.type === 'svg') {
        WIP.tag = SVG
      }
      WIP.node = createElement(WIP)
      // console.log('???', WIP.node)

      return WIP
    }),
    compose(WIP => WIP)
  ),
  WIP => {
    // console.log('WIP.node', WIP.node)
    return WIP.node ? Right.of(WIP) : Left.of(WIP)
  }
)

const updateHook = (WIP) => {
  if (
    WIP.type.tag === MEMO &&
    WIP.dirty == 0 &&
    !shouldUpdate(WIP.oldProps, WIP.props)
  ) {
    cloneChildren(WIP)
    return
  }
  currentFiber = WIP
  WIP.type.fiber = WIP
  // resetCursor?? 重置
  resetCursor()
  let children = WIP.type(WIP.props)
  if (isStr(children)) {
    children = createText(children)
  }
  reconcileChildren(WIP, children)
  return WIP
}

export const reconcile = compose(
  Either(
    compose(WIP => {
      while (WIP) {
        // preCommit ??
        // 忘记了
        // console.log(preCommit, WIP.dirty)
        if (!preCommit && WIP.dirty === false) {
          // console.log('first', WIP)
          // console.log(WIP)
          preCommit = WIP
          return null
        }
        if (WIP.sibling) {
          return WIP.sibling
        }
        // 忘记了是做什么了，变为parent，是否会回到root节点？
        WIP = WIP.parent
      }
    }),
    compose(WIP => WIP),
  ),
  (WIP) => {
    const pIns = getParentNode(WIP)
    WIP.parentNode = pIns

    isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
    WIP.dirty = WIP.dirty ? false : 0
    WIP.oldProps = WIP.props
    // 其实是每次update完，将children的关系处理完，将WIP的status处理完之后，再将该fiber推入commitItemsArr中
    pushCommitItem(WIP)

    return WIP.child ? Right.of(WIP.child) : Left.of(WIP)
  },
)

export const reconcileWorkLoop = compose(
  Either(
    compose(
      // () => WIP || null
      (WIP) => WIP,
    ),
    compose(
      // reconcile
      // () => function

      ({ WIP, didout }) => () => reconcileWorkLoop(didout, WIP), // 用于触发trancompile tail recurse
      
      ({ WIP, didout }) => ({ WIP: reconcile(WIP), didout }),      
    ),
  ),
  (didout, WIP) => {
    // some problem
    const goonWork = !shouldYield() || didout
    return (goonWork && WIP) ? Right.of({WIP, didout}) : Left.of(WIP)
  },
)

// const reconcileBase = curry()

// reconcileWork :: didout -> ( () => {}|null )
// reconcileWork finishe
export const reconcileWork = compose(
  Either(
    compose(
      () => {
        console.log('end')
        if (preCommit) commitWork(preCommit)
        return null
      }
    ),
    compose(rcWorkFunc => rcWorkFunc), // so we return a function
  ),
  ({ didout, newWIP }) => {
    const notOut = !didout // current WIP not out, so can be processed in next reconcileLoop(reconcile stream)
    return (notOut && newWIP) ? Right.of(reconcileWork.bind(null)) : Left.of(null)
  },
  (didout) => {
    if (!getWIP()) updateWIP(shiftUpdateItem()._value)
    const WIP = getWIP()
    // 到这里没有问题，因为还没有处理到WIP
    // 实际上需要reconcileWorkLoop来处理wip，但是reconcileWorkLoop暂时还没对WIP进行处理
    const newWIP = trampoline(curry(reconcileWorkLoop)(didout))(WIP)
    // updateWIP(null) // 之后注释即可， 因为WIP没有变为null，所以这里会一直循环下去，之后把这里删掉就可以
    // 这里先将WIP=null，保证不会一直循环
    return { didout, newWIP }
  },
)