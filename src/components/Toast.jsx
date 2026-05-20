function Toast({ toast }) {
  if (!toast) {
    return null
  }

  const isError = toast.type === 'error'
  const bgClass = isError
    ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/20'
    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-emerald-500/20'

  return (
    <div
      className={`fixed bottom-10 right-10 px-6 py-4 rounded-2xl text-white font-display text-sm font-semibold shadow-2xl border border-white/10 z-[1000] flex items-center gap-3 animate-fade-in-up ${bgClass}`}
    >
      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
      {toast.message}
    </div>
  )
}

export default Toast
