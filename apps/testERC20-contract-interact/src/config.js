import contract from '../contracts/contract.json'
import addressJson from '../contracts/address.json'

const contractAddress = addressJson.address; // 替换为你的合约地址
const abi = contract.abi

export { contractAddress, abi };
