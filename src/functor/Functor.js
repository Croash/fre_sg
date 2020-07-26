class Functor {
  constructor(value) {
    this._value = value
  }

  map = (f) => {
    return Functor.of(f(this._value))
  }

}

Functor.of = (val) => {
  return new Functor(val)
}

export default Functor

