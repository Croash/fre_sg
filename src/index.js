import { getTime } from './scheduler'

window.getTime = getTime
console.log(getTime())
