import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { http } from 'wagmi'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
const rpcCandidates = [
  import.meta.env.VITE_ANKR_API_KEY ? `https://rpc.ankr.com/eth_sepolia/${import.meta.env.VITE_ANKR_API_KEY}` : undefined,
  import.meta.env.VITE_SEPOLIA_RPC_URL,
  'https://ethereum-sepolia-rpc.publicnode.com',
  'https://rpc.sepolia.org'
].filter(Boolean)
const rpcUrl = rpcCandidates[0]

if (!projectId) {
  throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID in environment variables.')
}

if (!rpcUrl) {
  throw new Error('Missing VITE_ANKR_API_KEY or VITE_SEPOLIA_RPC_URL in environment variables.')
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Blockshop',
  projectId: projectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(rpcUrl)
  },
  ssr: false
})

export { sepolia }
