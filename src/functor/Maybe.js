class Maybe {
  constructor(value) {
    this._value = value
  }

  map = (f) => {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this._value));
  }

  isNothing = () => {
    return (this._value === null || this._value === undefined)
  }

}

Maybe.of = (val) => {
  return new Maybe(val)
}

export default Maybe

