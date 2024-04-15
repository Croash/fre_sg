// src/App.jsx
import * as React from 'react'
import { useState } from 'react'; // 替换成你的 React like 库的引入方式

// 示例组件
const App = () => {
  const [num, setNum] = useState(0)
  return <div>
    hello fre_sg
    <button onClick={() => setNum(num + 1)}>{num}</button>
  </div>
}

export { App };
