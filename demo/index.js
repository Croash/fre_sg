import { h } from '../src/dom/h'
import { render } from '../src/fiber/reconciler'

function App() {
  return (
   <div>test</div>
  )
}

render(<App />, document.getElementById('app'))
