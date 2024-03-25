declare class Functor {
  constructor(value: any)
  map(f: Function)
  join()
  chain(f: Function)
  ap(other: Functor)
}

declare class Maybe extends Functor {
  isNothing(): boolean
}

declare class Left {
  _value: any
  constructor(value: any)
  map(f: Function): void
}

declare class Right extends Left {}

declare class IO extends Left {}

// TODO: Implement type later
declare function Either<T, P, U extends Left | Right>(f: T, g: P, e: U): any

declare function LiftA2(f:Function, a1:Functor, a2:Functor): Functor

declare function LiftA3(f:Function, a1:Functor, a2:Functor, a3:Functor): Functor

export {
  Functor,
  Maybe,
  Left,
  Right,
  IO,
  Either,
  LiftA2,
  LiftA3,
}