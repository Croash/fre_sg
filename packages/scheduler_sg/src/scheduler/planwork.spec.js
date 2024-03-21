import {  } from '../'

let func1234 = () => {
  let testFunct1 = () => {
    pushTask(()=>{
      console.log('123')}
    )
    pushTask(
      ()=>{console.log('456')
    })
  }
  testFunct1()
  flushBase(peekTask()._value)
}
func1234()