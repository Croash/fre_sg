import { compose } from 'ramda'

export default class IO {
  constructor(f) {
    this._value = f;
  }

  map = (f) => {
    return new IO(compose(f, this._value));
  }
}

IO.of = function(x) {
  return new IO(function() {
    return x;
  });
}
