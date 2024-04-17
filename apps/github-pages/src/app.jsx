// src/App.jsx
import * as React from 'react'
import { useState } from 'react'; // 替换成你的 React like 库的引入方式
import './index.css'

// 示例组件
const App = () => {
  const [num, setNum] = useState(0)
  return <div className='text-center'>
    <h1 className="text-3xl font-bold underline">
        Hello fre_sg!
    </h1>
    <button onClick={() => setNum(num + 1)}>{num}</button>
  </div>
}

export { App };
