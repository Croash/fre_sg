import { compose, curry } from 'ramda'

// Left
export class Left {
  constructor(value) {
    this._value = value
  }

  map = () => {
    return this
  }
}

Left.of = (val) => {
  return new Left(val)
}

// Right
export class Right {
  constructor(value) {
    this._value = value
  }

  map = (f) => {
    return Right.of(f(this._value))
  }
}

Right.of = (val) => {
  return new Right(val)
}

export const Either = curry(function(f, g, e) {
  switch(e.constructor) {
    case Left: return f(e._value);
    case Right: return g(e._value);
  }
})
