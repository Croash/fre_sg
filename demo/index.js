import { h } from '../src/dom/h'
import { render } from '../src/dom/render'

function App() {
  return (
   <div>test</div>
  )
}

render(<App />, document.getElementById('app'))
