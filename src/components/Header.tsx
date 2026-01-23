export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-dark-card/95 backdrop-blur-sm border-b border-dark-border p-3 sm:p-4 flex items-center justify-between z-50 shadow-lg">
      {/* Container for centering on desktop */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg flex-shrink-0">
            🤖
          </div>
          <div>
            <h1 className="text-sm sm:text-base md:text-xl font-bold text-primary leading-tight">Phi-Five Bot</h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-dark-muted block">Chat with AI</p>
          </div>
        </div>
        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-dark-bg hover:bg-dark-border active:bg-dark-border flex items-center justify-center text-base sm:text-lg transition-all duration-200 flex-shrink-0">
          ⚙️
        </button>
      </div>
    </header>
  )
}
