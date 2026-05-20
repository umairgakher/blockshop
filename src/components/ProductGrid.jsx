import ProductCard from './ProductCard'

function ProductGrid({
  products,
  quantities,
  processing,
  isConnected,
  isPaused,
  networkError,
  onBuy,
  onQuantityChange
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <ProductCard
            product={product}
            quantity={quantities[product.id] || 1}
            isConnected={isConnected}
            isPaused={isPaused}
            isProcessing={Boolean(processing[product.id])}
            networkError={networkError}
            onBuy={onBuy}
            onQuantityChange={onQuantityChange}
          />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
