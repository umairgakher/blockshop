import { formatPrice } from '../utils/formatters'
import ProductImage from './ProductImage'

function ProductCard({
  product,
  quantity,
  isConnected,
  isPaused,
  isProcessing,
  networkError,
  onBuy,
  onQuantityChange
}) {
  const isDisabled = !isConnected || !product.isActive || product.stock === 0 || isProcessing || Boolean(networkError) || isPaused

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(product.id, quantity - 1, product.stock)
    }
  }

  const handleIncrement = () => {
    if (quantity < product.stock) {
      onQuantityChange(product.id, quantity + 1, product.stock)
    }
  }

  return (
    <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[24px] p-5 flex flex-col transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),_0_0_30px_rgba(139,92,246,0.12)] hover:-translate-y-2 relative overflow-hidden group">
      {/* Decorative Gradient Background Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Image Container with Shimmer & Fallbacks */}
      <div className="relative w-full h-[220px] rounded-[18px] overflow-hidden bg-slate-950/80 mb-5 border border-white/5">
        <ProductImage
          src={product.imageURI}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 relative z-10">
        {/* Badges row */}
        <div className="flex justify-between items-center mb-4">
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full font-display text-[11px] font-bold tracking-wide">
            Asset #{product.id}
          </span>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-display text-[10px] font-extrabold uppercase tracking-widest ${
            product.isActive 
              ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/20' 
              : 'bg-red-500/8 text-red-400 border border-red-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              product.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
            }`}></span>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Name & Desc */}
        <h3 className="font-display text-lg font-bold text-slate-100 mb-2 group-hover:text-purple-300 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-5 h-[2.8rem] overflow-hidden" title={product.description}>
          {product.description}
        </p>

        {/* Pricing Container */}
        <div className="flex justify-between items-center p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-[14px] h-[22px] drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]" viewBox="0 0 784 1277" xmlns="http://www.w3.org/2000/svg">
              <path d="M392 0L383.5 28.5V868.5L392 877L784 646L392 0Z" fill="#a5b4fc" />
              <path d="M392 0L0 646L392 877V469.5V0Z" fill="#e0e7ff" />
              <path d="M392 877L387 882V1271.5L392 1277L784 759L392 877Z" fill="#6366f1" />
              <path d="M392 1277V877L0 759L392 1277Z" fill="#e0e7ff" />
              <path d="M392 806L784 646L392 470V806Z" fill="#4f46e5" />
              <path d="M0 646L392 806V470L0 646Z" fill="#818cf8" />
            </svg>
            <span className="font-display text-lg font-extrabold text-white flex items-baseline gap-1">
              {formatPrice(product.priceEth)} <span className="text-xs font-extrabold text-indigo-400">ETH</span>
            </span>
          </div>
          <span className="font-display text-xs font-semibold text-slate-400">
            Stock: <span className="text-emerald-400 font-extrabold text-sm ml-1">{product.stock}</span>
          </span>
        </div>

        {/* stats rows */}
        <div className="flex justify-between text-xs text-slate-500 mb-5 px-1">
          <span>Sold: <strong className="text-slate-300">{product.sold}</strong></span>
          <span>Supply: <strong className="text-slate-300">{product.stock + product.sold}</strong></span>
        </div>

        {/* Custom Pill Counter Selector */}
        <div className="flex items-center justify-between py-3 border-t border-dashed border-white/5 mb-5">
          <label className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quantity
          </label>
          <div className="flex items-center bg-slate-950/80 border border-white/5 rounded-xl p-1">
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-90 transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none"
              onClick={handleDecrement}
              disabled={quantity <= 1 || isDisabled}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span className="w-9 text-center font-display text-sm font-extrabold text-white">
              {quantity}
            </span>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-90 transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none"
              onClick={handleIncrement}
              disabled={quantity >= product.stock || isDisabled}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Dynamic purchase action button with gradients */}
        <button
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-display text-sm font-extrabold rounded-2xl shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 active:scale-[0.98] disabled:from-white/3 disabled:to-white/3 disabled:border disabled:border-white/5 disabled:text-slate-500 disabled:shadow-none disabled:-translate-y-0 disabled:pointer-events-none flex justify-center items-center relative"
          onClick={() => onBuy(product)}
          disabled={isDisabled}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2.5 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : !product.isActive ? (
            'Inactive'
          ) : (
            'Purchase Asset'
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
