import { compose, curry } from 'ramda'

const liftA2 = curry(function(f, a1, a2){
  return a1.map(f).ap(a2);
})

const liftA3 = curry(function(f, a1, a2, a3){
  return a1.map(f).ap(a2).ap(a3);
})

export {
  liftA2,
  liftA3
}
