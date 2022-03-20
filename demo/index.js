import { h } from '../src/dom/h'
import { render } from '../src/fiber/reconciler'
import { useState } from '../src/fiber/hooks'

function App() {
  const [val, updateVal] = useState(1234)

  const [val1, updateVal1] = useState(5678)
  return (
    <div>
      test
      <button onClick={() => {
        updateVal(val + 1)
      }}>{val}</button>
      <button onClick={() => {
        updateVal1(val1 + 1)
      }}>{val1}</button>
    </div>
  )
}

render(<App />, document.getElementById('app'))
