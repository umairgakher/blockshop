import { useState, useEffect } from 'react'

function ProductImage({ src, alt, className = '' }) {
  const [imgSrc, setImgSrc] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const sanitizeUrl = (url) => {
    if (!url) return ''
    let cleaned = url.trim()
    cleaned = cleaned.replace(/^['"\s]+|['"\s]+$/g, '')
    cleaned = cleaned.replace(/%27$/g, '')
    cleaned = cleaned.replace(/'$/g, '')
    return cleaned
  }

  useEffect(() => {
    const cleanUrl = sanitizeUrl(src);
    if (!cleanUrl) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    // Encode the URL to handle spaces and special characters
    const encodedUrl = encodeURI(cleanUrl);
    setImgSrc(encodedUrl);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div className={`relative w-full h-[220px] bg-gradient-to-br from-purple-950/20 via-slate-900/50 to-slate-950 flex flex-col items-center justify-center p-6 border-b border-white/5 overflow-hidden text-center ${className}`}>
        <div className="absolute w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <svg
          className="w-11 h-11 text-purple-400 mb-3 drop-shadow-[0_0_12px_rgba(139,92,246,0.4)] animate-float z-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span className="font-display text-[11px] font-extrabold text-purple-300 tracking-wider uppercase mb-1 z-10">
          Digital Asset Preview
        </span>
        <span className="text-xs text-slate-500 max-w-[85%] truncate z-10">
          {alt || 'No Image Available'}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-950 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 bg-[length:200%_100%] animate-pulse z-10"></div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

export default ProductImage
