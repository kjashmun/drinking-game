export default function Display() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold text-white mb-4">
            🎮 Display Route
          </h1>
          <p className="text-3xl text-purple-200">
            This is the TV/Shared Screen View
          </p>
        </div>

        {/* Room Code Display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl mb-8">
          <div className="text-center">
            <p className="text-2xl text-purple-300 mb-4">Room Code</p>
            <div className="bg-white/20 rounded-2xl p-8 inline-block">
              <p className="text-8xl font-mono font-bold text-white tracking-wider">
                DEMO
              </p>
            </div>
          </div>
        </div>

        {/* Player List Placeholder */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Players in Lobby
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <p className="text-3xl text-white">👤 Host</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <p className="text-3xl text-white">👤 Player 2</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-purple-300 text-xl">
          <p>Story 1.3: Display Route ✓</p>
          <p className="text-sm mt-2">Landscape-optimized for TV viewing</p>
        </div>
      </div>
    </div>
  )
}
