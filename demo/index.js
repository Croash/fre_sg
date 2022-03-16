import { h } from '../src/dom/h'
import { render } from '../src/fiber/reconciler'

function App() {
  return (
    <div>
      test
      <span>1234</span>
      <span>5678</span>
    </div>
  )
}

render(<App />, document.getElementById('app'))
