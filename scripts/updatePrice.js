/*
  scripts/updatePrice.js
  ====================
  This script connects to the Blockshop smart contract on Sepolia and updates the price of a given product
  to a very low amount (0.00000001 ETH). It uses ethers.js directly (you can also integrate it with wagmi if
  you prefer). Ensure you have the PRIVATE_KEY of an address that is authorised (e.g., the contract owner)
  and that the contract includes a `setProductPrice(uint256 productId, uint256 newPrice)` function.
*/

require('dotenv').config()
const { ethers } = require('ethers')

// -----------------------------------------------------------------------------
// Configuration – adjust the values below to match your environment.
// -----------------------------------------------------------------------------
const RPC_URL = process.env.VITE_SEPOLIA_RPC_URL // Sepolia RPC URL from .env.local
const PRIVATE_KEY = process.env.PRIVATE_KEY // Owner address private key (keep secret!)
const CONTRACT_ADDRESS = require('../src/contracts/blockshop').CONTRACT_ADDRESS
const ABI = require('../src/contracts/blockshop').CONTRACT_ABI

// -----------------------------------------------------------------------------
// Helper: converts ETH to wei (BigNumber)
// -----------------------------------------------------------------------------
function ethToWei(eth) {
  return ethers.parseEther(eth.toString()) // ethers v6 API
}

async function main() {
  if (!RPC_URL || !PRIVATE_KEY) {
    console.error('❌ Missing RPC URL or PRIVATE_KEY in environment variables.')
    process.exit(1)
  }

  // Initialise provider and signer
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const signer = new ethers.Wallet(PRIVATE_KEY, provider)

  // Instantiate contract instance (owner signer required for setProductPrice)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)

  // ---------------------------------------------------------------------------
  //   USER INPUT – change these values to target the product you want to edit.
  // ---------------------------------------------------------------------------
  const productId = 1 // <-- replace with the product ID you wish to update
  const newPriceEth = 0.00000001 // Desired price in ETH

  const newPriceWei = ethToWei(newPriceEth)

  console.log(`🛠️  Updating product #${productId} price to ${newPriceEth} ETH (${newPriceWei} wei)...`)

  // Call the contract method – ensure the method exists in your Solidity contract.
  const tx = await contract.setProductPrice(productId, newPriceWei)
  console.log('📡 Sent transaction, waiting for confirmation... (hash:', tx.hash, ')')

  const receipt = await tx.wait()
  console.log('✅ Transaction confirmed in block', receipt.blockNumber)
  console.log('🧾 Updated price for product', productId)
}

main().catch(error => {
  console.error('❗ An error occurred:', error)
  process.exit(1)
})
