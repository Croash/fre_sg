import { compose, composeP, curry, map, prop } from 'ramda'
import { scheduleCallback, shouldYield, getTime } from 'scheduler_sg'
// import { getTime } from '../scheduler/common'
import { createElement, SVG } from '../dom/dom'
import { pushUpdateItem, shiftUpdateItem } from './updateQueue'
import { pushCommitItem, shiftCommitItem } from './commitQueue'
import { preCommitFunctor, getPreCommit } from './preComit'
import { getWIP, updateWIP } from './WIP'
import { isFn, trampoline, consoleFunc } from '../utils'
import { getParentNode } from './getParentNode'
import { shouldPlace, shouldUpdate } from './utils'

import { Either, Left, Right } from '../functor'
let preCommit = null
let WIP = null

const reconcileChildren = compose(
  Either(
    compose(nil => nil),
    compose(WIP => WIP),
  ),
  (WIP, children) => {
    console.log('WIP, children',WIP, children)
    return children ? Right.of(WIP) : Left.of(null)
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
  },
  Either(
    compose(WIP => {
      if (WIP.type === 'svg') {
        WIP.tag = SVG
      }
      WIP.node = createElement(WIP)
    }),
    compose(WIP => WIP)
  ),
  WIP => {
    return WIP.node ? Right.of(WIP) : Left.of(WIP)
  }
)

const updateHook = (WIP) => {
  console.log('hook')
  return WIP
}

export const reconcile = compose(
  Either(
    compose(WIP => {
      // trampoline tail recurse how to work ???
      // const reconcileLoop = compose((WIP) => WIP)
      // WIP = trampoline(curry(reconcileLoop)(WIP))()
      return WIP
    }),
    compose(WIP => WIP),
  ),
  (WIP) => {
    WIP.parentNode = getParentNode(WIP)
    isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
    WIP.dirty = WIP.dirty ? false : 0
    WIP.oldProps = WIP.props
    // 这里就push吗，不太理解
    // console.log('push213')
    // commitItems 这里push了多次，有问题
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
      (WIP) => reconcile(WIP),
    ),
  ),
  (didout, WIP) => {
    // some problem
    const goonWork = !shouldYield() || didout
    // console.log('goonWork && WIP', shouldYield(), getTime())
    return (goonWork && WIP) ? Right.of(WIP) : Left.of(WIP)
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
        if(preCommit) pushUpdateItem(preCommit)
        return null
      }
    ),
    compose(rcWorkFunc => rcWorkFunc), // so we return a function
  ),
  ({ didout, newWIP }) => {
    const notOut = !didout // current WIP not out, so can be processed in next reconcileLoop(reconcile stream)
    // console.log('newWIP',newWIP, notOut, notOut && newWIP)
    // console.log((!notOut && newWIP))// ?? not sure
    console.log('notOut && newWIP', notOut && newWIP)
    return (notOut && newWIP) ? Right.of(reconcileWork.bind(null)) : Left.of(null)
  },
  (didout) => {
    if (!getWIP()) updateWIP(shiftUpdateItem()._value)
    WIP = getWIP()
    // 到这里没有问题，因为还没有处理到WIP
    // 实际上需要reconcileWorkLoop来处理wip，但是reconcileWorkLoop暂时还没对WIP进行处理
    const newWIP = trampoline(curry(reconcileWorkLoop)(didout))(WIP)
    updateWIP(null) // 之后注释即可， 因为WIP没有变为null，所以这里会一直循环下去，之后把这里删掉就可以
    // 这里先将WIP=null，保证不会一直循环
    return { didout, newWIP }
  },
)