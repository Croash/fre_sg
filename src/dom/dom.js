export const SVG = 4

export function updateElement(dom, oldProps, newProps) {
  for (let name in { ...oldProps, ...newProps }) {
    let oldValue = oldProps[name]
    let newValue = newProps[name]
    /**
     * 1. equal or children, no opt
     * 2. style, update style
     * 3. on means bind function, remove old, bind new
     * 4. has newVal, set
     * 5. new is null, remove
     * 6. otherwise set val
     */
    if (oldValue == newValue || name === 'children') {
    } else if (name === 'style') {
      for (const k in { ...oldValue, ...newValue }) {
        if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
          dom[name][k] = (newValue && newValue[k]) || ''
        }
      }
    } else if (name[0] === 'o' && name[1] === 'n') {
      // 'o' && 'n' ?? on, wtf, on means this is function
      name = name.slice(2).toLowerCase()
      if (oldValue) dom.removeEventListener(name, oldValue)
      dom.addEventListener(name, newValue)
    } else if (name in dom && !(dom instanceof SVGElement)) {
      dom[name] = newValue == null ? '' : newValue
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, newValue)
    }
  }
}

export function createElement(fiber) {
  const dom =
    fiber.type === 'text'
      ? document.createTextNode('')
      : fiber.tag === SVG
      ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
      : document.createElement(fiber.type)
  updateElement(dom, {}, fiber.props)
  return dom
}
