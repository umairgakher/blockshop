import EmptyState from './EmptyState'
import ProductGrid from './ProductGrid'

function ProductsSection({
  isLoading,
  products,
  publicClient,
  quantities,
  processing,
  isConnected,
  isPaused,
  networkError,
  onRefresh,
  onBuy,
  onQuantityChange
}) {
  return (
    <section className="flex flex-col gap-8 w-full animate-fade-in-up">
      <div className="flex justify-between items-center border-b border-white/5 pb-5">
        <h2 className="font-display text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Metaverse Digital Assets
        </h2>
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-white/2 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 text-slate-200 hover:text-purple-300 rounded-xl font-display text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
          onClick={onRefresh}
          disabled={!publicClient || isLoading}
        >
          <svg
            className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          Sync Catalog
        </button>
      </div>

      {isLoading || products.length === 0 ? (
        <EmptyState isLoading={isLoading} />
      ) : (
        <ProductGrid
          products={products}
          quantities={quantities}
          processing={processing}
          isConnected={isConnected}
          isPaused={isPaused}
          networkError={networkError}
          onBuy={onBuy}
          onQuantityChange={onQuantityChange}
        />
      )}
    </section>
  )
}

export default ProductsSection
