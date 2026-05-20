import { SAMPLE_PRODUCT_INPUTS } from '../data/sampleProducts'

function EmptyState({ isLoading }) {
  if (isLoading) {
    return (
      <div className="text-center py-24 px-6 border border-dashed border-white/5 rounded-[24px] bg-white/[0.01] backdrop-blur-sm">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>
        <h3 className="font-display text-xl font-bold text-white mb-2">Syncing Sepolia Ledger...</h3>
        <p className="text-sm text-slate-400">Fetching digital assets from the smart contract catalog.</p>
      </div>
    )
  }

  return (
    <div className="text-center py-16 px-6 border border-dashed border-white/5 rounded-[32px] bg-white/[0.01] backdrop-blur-sm">
      <h3 className="font-display text-2xl font-bold text-white mb-2">No Assets Listed</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-10">
        No active products were found. Use <code className="bg-white/5 px-2 py-0.5 rounded text-purple-300 font-mono">createProduct</code> on Sepolia and sync the catalog.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
        {SAMPLE_PRODUCT_INPUTS.map((product) => (
          <div
            key={product.name}
            className="flex flex-col gap-2.5 p-5 bg-slate-950/40 border border-white/5 rounded-[20px] hover:border-purple-500/20 hover:bg-white/[0.02] transition-all duration-300"
          >
            <strong className="font-display text-sm font-bold text-slate-100">{product.name}</strong>
            <span className="text-xs text-slate-400 line-clamp-2 leading-relaxed h-8">{product.description}</span>
            <code className="block bg-black/40 border border-white/3 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-purple-300 break-all select-all">
              priceWei: {product.priceWei}
            </code>
            <code className="block bg-black/40 border border-white/3 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-emerald-400 select-all">
              stock: {product.stock}
            </code>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmptyState
