// src/App.jsx
import * as React from 'react'
import { useState, useEffect } from 'react'; // 替换成你的 React like 库的引入方式
import { buyCoffee, getMemos } from './contractInteraction';
import './index.css'

// 示例组件
const App = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [memos, setMemos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [num, setNum] = useState(12)

  async function fetchMemos() {
    try {
      const fetchedMemos = await getMemos();
      setMemos(fetchedMemos);
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    fetchMemos();
  }, []);

  useEffect(() => {
    try {
      if (!window.ethereum) {
        setErrorMessage('MetaMask not found. Please install MetaMask and try again.');
      }
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const handleBuyCoffee = async () => {
    if (!window.ethereum) {
      setErrorMessage('MetaMask not found. Please install MetaMask and try again.');
      return;
    }

    await buyCoffee(name, message, amount);
    const fetchedMemos = await getMemos();
    setMemos(fetchedMemos);
  };


  return <div className='text-center'>
    <h1 className="text-3xl font-bold underline">
        Hello fre_sg!
    </h1>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    <input 
      type="text" 
      placeholder="Your Name" 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
    />
    <input 
      type="text"
      placeholder="Your Message" 
      value={message} 
      onChange={(e) => setMessage(e.target.value)} 
    />
    <input 
      type="text" 
      placeholder="Amount in ETH" 
      value={amount} 
      onChange={(e) => setAmount(e.target.value)} 
    />
    <button onClick={handleBuyCoffee}>Buy Coffee</button>
    <h2>Memos</h2>
    {memos.length > 0 ? (
      memos.map((memo, index) => (
        <div key={index}>
          <p>From: {memo.from}</p>
          <p>Name: {memo.name}</p>
          <p>Message: {memo.message}</p>
        </div>
      ))
    ) : (
      <p>No memos yet</p>
    )} 
  </div>
}

export { App };
