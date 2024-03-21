/**
 * @param {any} node - node
 * @param {Object} props - props
 * @param {any} done - 是否完成
 */

interface fiberProps {
  node: any
  props: Object
  done: boolean | null
}

const fiber: fiberProps = {
  node: '',
  props: {},
  done: false,
}