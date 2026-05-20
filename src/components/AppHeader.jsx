import { ConnectButton } from '@rainbow-me/rainbowkit'

function AppHeader() {
  return (
    <header className="flex justify-between items-center px-6 md:px-12 py-4 bg-brand-dark/75 backdrop-blur-xl border-b border-brand-border sticky top-0 z-50 shadow-lg">
      <div className="font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent hover:cursor-pointer transition-all duration-300 relative group">
        Blockshop
        <span className="absolute bottom-[-4px] left-0 w-1/4 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
      </div>
      <div className="flex items-center gap-4">
        <ConnectButton />
      </div>
    </header>
  )
}

export default AppHeader
