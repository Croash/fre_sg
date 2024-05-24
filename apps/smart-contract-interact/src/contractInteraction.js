import { ethers } from 'ethers';
import { contractAddress, abi } from './config.js';

async function getContract() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.JsonRpcProvider('http://localhost:7545')
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
  } else {
    alert('MetaMask not found');
    return null;
  }
}

async function buyCoffee(name, message, amount) {
  const contract = await getContract();
  if (contract) {
    try {
      const tx = await contract.buyCoffee(name, message, { value: ethers.parseEther(amount) }); // 
      await tx.wait();
      console.log('Coffee purchased!');
    } catch (err) {
      console.error('Error purchasing coffee:', err);
    }
  }
}

async function getMemos() {
  const contract = await getContract();
  if (contract) {
    try {
      const memos = await contract.getMemos();
      return memos;
    } catch (err) {
      console.error('Error getting memos:', err);
    }
  }
  return [];
}

export { buyCoffee, getMemos };
