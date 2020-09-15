/**
 * @param {any} node - node
 * @param {Object} props - props
 * @param {any} done - 是否完成
 */

interface fiberProps {
  node: any
  props: Object
  done: boolean
}

const fiber = {
  node: '',
  props: {},
  done: false,
}