import { useSocket } from '../hooks/useSocket'

export default function Controller() {
  const { isConnected, socketId } = useSocket()
  const isDev = import.meta.env.VITE_DEBUG === 'true'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-6">
      {/* Connection Status Bar */}
      <div className="absolute top-0 left-0 right-0 p-3 flex justify-center items-center bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-white text-xs font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="max-w-md w-full mt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            📱 Controller
          </h1>
          <p className="text-lg text-purple-200">
            Phone View
          </p>
        </div>

        {/* Player Info Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-purple-300 mb-2">Your Name</p>
            <p className="text-3xl font-bold text-white">Demo Player</p>
          </div>
          <div className="flex justify-around text-center pt-4 border-t border-white/20">
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-purple-300">Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-purple-300">Drinks</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transform transition hover:scale-105 shadow-lg mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isConnected}
        >
          Ready!
        </button>

        {/* Game Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <p className="text-center text-purple-200">
            {isConnected ? 'Waiting for host to start the game...' : 'Connecting to server...'}
          </p>
        </div>

        {/* Debug Info */}
        <div className="mt-8 text-center text-purple-300 text-sm space-y-1">
          <p>Story 1.3: Controller Route ✓</p>
          <p className="text-xs mt-1">Portrait-optimized for phones</p>
          {isDev && socketId && (
            <p className="text-xs font-mono mt-2 opacity-50">ID: {socketId.substring(0, 8)}...</p>
          )}
        </div>
      </div>
    </div>
  )
}
