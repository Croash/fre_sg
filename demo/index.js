import { h, useRef } from '../src/index'
import { render } from '../src/fiber/reconciler'
import { useState } from '../src/fiber/hooks'

function App() {
  const appRef = useRef(null)
  console.log(appRef)
  const [val, updateVal] = useState(1234)

  const [val1, updateVal1] = useState(5678)

  const [inputVal, updateInput] = useState('')
  console.log('inputVal', inputVal)
  return (
    <div>
      test
      <input value={inputVal} onChange={(e) => {
        console.log('vv', e.target.value)
        updateInput(e.target.value)
      }}></input>
      <button
        ref={appRef}
        onClick={() => {
        updateVal(val + 1)
      }}>{val}</button>
      <button onClick={() => {
        updateVal1(val1 + 1)
      }}>{val1}</button>
      { inputVal}
      <div style={{ height: 100, width: 100 }} dangerouslySetInnerHTML={inputVal} ></div>
    </div>
  )
}

render(<App />, document.getElementById('app'))
