import { config as loadEnv } from 'dotenv'
import { ethers } from 'ethers'

loadEnv({ path: '.env.local' })
loadEnv()

const CONTRACT_ADDRESS = '0x3381d2f3E5d41c33D85C203621C3974d10B468D8'
const ANKR_API_KEY = process.env.VITE_ANKR_API_KEY
const FALLBACK_RPC_URL = process.env.VITE_SEPOLIA_RPC_URL
const RPC_URL = ANKR_API_KEY
  ? `https://rpc.ankr.com/eth_sepolia/${ANKR_API_KEY}`
  : FALLBACK_RPC_URL
const RAW_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY
const PRIVATE_KEY = RAW_PRIVATE_KEY
  ? (RAW_PRIVATE_KEY.startsWith('0x') ? RAW_PRIVATE_KEY : `0x${RAW_PRIVATE_KEY}`)
  : ''

const PRODUCTS = [
  {
    name: 'Cyberpunk Jacket',
    description: 'Limited edition digital fashion piece',
    priceWei: '10000000000000000',
    stock: '15',
    imageURI: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop'
  },
  {
    name: 'Digital Sneakers',
    description: 'Exclusive virtual footwear for your metaverse avatar',
    priceWei: '20000000000000000',
    stock: '8',
    imageURI: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
  },
  {
    name: 'NFT Art Collection',
    description: 'Unique generative art piece from renowned digital artist',
    priceWei: '50000000000000000',
    stock: '3',
    imageURI: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop'
  },
  {
    name: 'Virtual Land Plot',
    description: 'Premium virtual real estate in exclusive metaverse district',
    priceWei: '100000000000000000',
    stock: '2',
    imageURI: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=300&fit=crop'
  }
]

const ABI = [
  'function owner() view returns (address)',
  'function createProduct(string name,string description,uint256 price,uint256 stock,string imageURI) returns (uint256)',
  'function productCount() view returns (uint256)'
]

async function main() {
  if (!RPC_URL) {
    throw new Error('Missing VITE_ANKR_API_KEY or VITE_SEPOLIA_RPC_URL in environment variables.')
  }

  if (!PRIVATE_KEY) {
    throw new Error('Missing SEPOLIA_PRIVATE_KEY in environment variables.')
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const network = await provider.getNetwork()

  if (network.chainId !== 11155111n) {
    throw new Error(`Connected RPC is not Sepolia. Received chainId ${network.chainId.toString()}.`)
  }

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)

  const owner = await contract.owner()
  if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error(`Connected wallet ${wallet.address} is not the contract owner ${owner}.`)
  }

  console.log(`Connected owner wallet: ${wallet.address}`)
  console.log(`Current product count: ${(await contract.productCount()).toString()}`)

  for (const [index, product] of PRODUCTS.entries()) {
    console.log(`Adding product ${index + 1}/${PRODUCTS.length}: ${product.name}`)

    const tx = await contract.createProduct(
      product.name,
      product.description,
      BigInt(product.priceWei),
      BigInt(product.stock),
      product.imageURI
    )

    console.log(`Submitted tx: ${tx.hash}`)
    const receipt = await tx.wait()
    console.log(`Confirmed in block ${receipt.blockNumber}`)
  }

  console.log(`Final product count: ${(await contract.productCount()).toString()}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
