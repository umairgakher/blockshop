import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import AppHeader from './components/AppHeader'
import NoticeBanner from './components/NoticeBanner'
import ProductsSection from './components/ProductsSection'
import Toast from './components/Toast'
import { CONTRACT_ABI, CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from './contracts/blockshop'
import { mapProduct } from './utils/product'

function App() {
  const [products, setProducts] = useState([])
  const [quantities, setQuantities] = useState({})
  const [processing, setProcessing] = useState({})
  const [toast, setToast] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [networkError, setNetworkError] = useState('')
  const { address: account, chainId, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const isSepolia = chainId === Number(SEPOLIA_CHAIN_ID)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3000)
  }, [])

  const loadProducts = useCallback(async () => {
    if (!publicClient) {
      setProducts([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const paused = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'paused'
      })
      const allProducts = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAllProducts'
      })
      const normalizedProducts = allProducts
        .map(mapProduct)
        .filter((product) => product.id > 0)

      setIsPaused(paused)
      setProducts(normalizedProducts)
      setQuantities((prev) => {
        const next = { ...prev }
        normalizedProducts.forEach((product) => {
          if (!next[product.id]) {
            next[product.id] = 1
          }
        })
        return next
      })
    } catch (error) {
      console.error(error)
      showToast('Failed to load products from contract.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [publicClient, showToast])

  useEffect(() => {
    if (!publicClient) {
      setIsLoading(false)
      return
    }

    loadProducts()
  }, [publicClient, loadProducts])

  useEffect(() => {
    if (!isConnected) {
      setNetworkError('')
      return
    }

    if (!isSepolia) {
      setNetworkError('Please switch wallet network to Sepolia Testnet.')
      return
    }

    setNetworkError('')
  }, [isConnected, isSepolia])

  const handleQuantityChange = (productId, value, maxStock) => {
    const parsedValue = Number.parseInt(value, 10)
    const safeValue = Number.isNaN(parsedValue) ? 1 : Math.min(Math.max(parsedValue, 1), maxStock || 1)

    setQuantities((prev) => ({ ...prev, [productId]: safeValue }))
  }

  const refreshProduct = async (productId) => {
    if (!publicClient) {
      return
    }

    const updatedProduct = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getProduct',
      args: [BigInt(productId)]
    })
    const normalizedProduct = mapProduct(updatedProduct)

    setProducts((prev) => prev.map((product) => (product.id === productId ? normalizedProduct : product)))
  }

  const handleBuy = async (product) => {
    if (!walletClient || !publicClient) {
      showToast('Contract is not ready yet.', 'error')
      return
    }

    if (!isConnected || !account) {
      showToast('Please connect your Web3 wallet first.', 'error')
      return
    }

    if (networkError) {
      showToast(networkError, 'error')
      return
    }

    if (isPaused) {
      showToast('Purchases are temporarily paused by the contract owner.', 'error')
      return
    }

    const quantity = quantities[product.id] || 1
    if (quantity > product.stock) {
      showToast('Requested quantity exceeds available stock.', 'error')
      return
    }

    setProcessing((prev) => ({ ...prev, [product.id]: true }))

    try {
      const totalPrice = BigInt(product.priceWei) * BigInt(quantity)

      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'placeOrder',
        args: [BigInt(product.id), BigInt(quantity)],
        value: totalPrice,
        chain: walletClient.chain
      })
      showToast('Transaction submitted. Waiting for validation block...')

      await publicClient.waitForTransactionReceipt({ hash: tx })

      await refreshProduct(product.id)
      const paused = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'paused'
      })
      setIsPaused(paused)
      showToast(`Successfully purchased ${quantity} digital asset(s).`)
    } catch (error) {
      console.error(error)
      const message = error.shortMessage || error.reason || error.message || 'Transaction failed.'
      showToast(message, 'error')
    } finally {
      setProcessing((prev) => ({ ...prev, [product.id]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-[#020205] text-slate-100 font-body relative overflow-x-hidden">
      {/* Background Cyber Glow Blobs */}
      <div className="fixed top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none z-0 animate-pulse-slow"></div>
      <div
        className="fixed bottom-[-10%] right-[15%] w-[500px] h-[500px] rounded-full bg-blue-600/4 blur-[120px] pointer-events-none z-0 animate-pulse-slow"
        style={{ animationDelay: '-3.5s' }}
      ></div>

      <AppHeader />

      <main className="max-w-[1320px] w-full mx-auto px-6 md:px-12 py-12 flex flex-col gap-10 relative z-10">
        {networkError && (
          <NoticeBanner
            title="Network Switch Required"
            message={networkError}
            code={`Contract: ${CONTRACT_ADDRESS}`}
            className="error-notice"
          />
        )}

        {isPaused && !networkError && (
          <NoticeBanner
            title="Orders Paused"
            message="The contract administrator has temporarily locked new item purchases on Sepolia."
            className="paused-notice"
          />
        )}

        <ProductsSection
          isLoading={isLoading}
          products={products}
          publicClient={publicClient}
          quantities={quantities}
          processing={processing}
          isConnected={isConnected}
          isPaused={isPaused}
          networkError={networkError}
          onRefresh={() => loadProducts()}
          onBuy={handleBuy}
          onQuantityChange={handleQuantityChange}
        />
      </main>

      <Toast toast={toast} />
    </div>
  )
}

export default App
