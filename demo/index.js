import { h, useRef } from '../src/index'
import { render } from '../src/fiber/reconciler'
import { useState } from '../src/fiber/hooks'

const VisibleComp = () => {
  const [num, setNum] = useState(92)
  return <div onClick={(e) => {
    e.preventDefault()
    setNum(num+1)
  }}>{num}</div>
}

function App() {
  const [val, updateVal] = useState(1234)
  const [val1, updateVal1] = useState(5678)
  const [inputVal, updateInput] = useState('')

  const [visible, setVisible] = useState(false)
  return (
    <div>
      test
      <input value={inputVal} onChange={(e) => {
        updateInput(e.target.value)
      }}></input>
      <button
        onClick={() => {
        updateVal(val + 1)
      }}>{val}</button>
      <button onClick={() => {
        updateVal1(val1 + 1)
      }}>{val1}</button>
      { inputVal}
      <div>
        <button
          onClick={(e) => {
            setVisible(!visible) }
          }
        >
          visBtn
        </button>
        { visible ? <VisibleComp /> : null }
      </div>
    </div>
  )
}

render(<App />, document.getElementById('app'))
