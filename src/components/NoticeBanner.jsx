function NoticeBanner({ title, message, code, className = '' }) {
  let bgClass = 'bg-purple-950/20 border-purple-500/25 text-purple-200'

  if (className.includes('error-notice')) {
    bgClass = 'bg-red-950/25 border-red-500/25 text-red-200'
  } else if (className.includes('paused-notice')) {
    bgClass = 'bg-amber-950/25 border-amber-500/25 text-amber-200'
  }

  return (
    <div className={`flex flex-col gap-2 p-6 border rounded-2xl backdrop-blur-xl shadow-lg ${bgClass}`}>
      <h3 className="font-display text-base font-bold tracking-tight">{title}</h3>
      <p className="text-sm opacity-85 leading-relaxed">{message}</p>
      {code ? (
        <code className="block bg-black/40 border border-white/5 rounded-lg px-3.5 py-2 text-xs font-mono text-purple-300 break-all select-all mt-1">
          {code}
        </code>
      ) : null}
    </div>
  )
}

export default NoticeBanner
