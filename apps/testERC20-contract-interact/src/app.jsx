// src/App.jsx
import * as React from 'react'
import { useState, useEffect } from 'react'; // 替换成你的 React like 库的引入方式
import { getBalance, mint, burn } from './contractInteraction';
import './index.css'

const reg = /^\d+(\.\d+)?$/

// 示例组件
const App = () => {
  const [balance, setBalance] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState(0);
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

  async function _mint() {
    if (!reg.test(amount)) {
      alert('not a valid value')
      return
    }
    mint({ account, amount })
  }

  async function _burn() {
    if (!reg.test(amount)) {
      alert('not a valid value')
      return
    }
    burn({ account, amount })
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
        Hello testERC20!
    </h1>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    <div>account:<input onChange={e => setAccount(e.target.value)}></input>
    <div>amount:<input onChange={e => setAmount(e.target.value)}></input>
    <button onClick={e => {
      _burn()
    }}>burn</button></div>
    <button onClick={e => {
      _mint()
    }}>mint</button></div>
    {/* <div>balance:{balance}</div> */}
  </div>
}

export { App };
