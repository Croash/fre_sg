// src/App.jsx
import * as React from 'react'
import { useState, useEffect } from 'react'; // 替换成你的 React like 库的引入方式
import { getBalance } from './contractInteraction';
import './index.css'

// 示例组件
const App = () => {
  const [balance, setBalance] = useState('');
  const [account, setAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function _getBalance() {
    try {
      const _balance = await getBalance(account)
      console.log('_balance', _balance)
      setBalance(_balance)
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    try {
      if (!window.ethereum) {
        setErrorMessage('MetaMask not found. Please install MetaMask and try again.');
      }
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  return <div className='text-center'>
    <h1 className="text-3xl font-bold underline">
        Hello fre_sg!
    </h1>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    <div>account:<input onChange={e => setAccount(e.target.value)}></input><button onClick={e => {
      _getBalance()
    }}>获取balance</button></div>
    <div>balance:{balance}</div>
  </div>
}

export { App };
