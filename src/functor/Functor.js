class Functor {
  constructor(value) {
    this._value = value
  }

  map = (f) => {
    return Functor.of(f(this._value))
  }

  join = () => {
    return this._value
  }

  chain = (f) => {
    return this.map(f).join()
  }

  ap = (other) => {
    return this.chain(function(f) {
      return other.map(f)
    })
  }
}

Functor.of = (val) => {
  return new Functor(val)
}

export default Functor

