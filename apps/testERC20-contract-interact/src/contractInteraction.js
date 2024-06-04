import { ethers } from 'ethers';
import { contractAddress, abi } from './config.js';

async function getContract() {
  if (window.ethereum) {
    const _p = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // const provider = new ethers.JsonRpcProvider('http://localhost:7545')
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    window.contract = contract
    return contract;
  } else {
    alert('MetaMask not found');
    return null;
  }
}

async function getBalance(account) {
  const contract = await getContract();
  window.getBalance = contract.getBalance
  console.log('account:', account)
  const balance = await contract.getBalance(account)
  console.log('balance', balance);
  return balance // getBalance
}

export { getContract, getBalance };
