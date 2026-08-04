import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useSocket } from '../hooks/useSocket'

export default function Home() {
  const { isConnected, connectionState, socketId, latency, measureLatency } = useSocket()
  const [isTesting, setIsTesting] = useState(false)
  const isDev = import.meta.env.VITE_DEBUG === 'true'

  const handlePingTest = async () => {
    setIsTesting(true)
    try {
      const result = await measureLatency()
      toast.success(`Ping successful! Latency: ${result}ms`)
    } catch (error) {
      toast.error('Ping failed - connection issue')
    } finally {
      setIsTesting(false)
    }
  }

  const getConnectionColor = () => {
    switch (connectionState) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500'
      case 'disconnected': return 'bg-red-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getConnectionText = () => {
    switch (connectionState) {
      case 'connected': return 'Connected'
      case 'connecting': return 'Connecting...'
      case 'disconnected': return 'Disconnected'
      case 'error': return 'Connection Error'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="max-w-2xl w-full">
        {/* Connection Status Indicator */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full">
            <div className={`w-3 h-3 rounded-full ${getConnectionColor()} ${isConnected ? 'animate-pulse' : ''}`} />
            <span className="text-sm text-white font-medium">{getConnectionText()}</span>
          </div>
          {latency !== null && (
            <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full">
              <span className="text-sm text-white font-medium">{latency}ms</span>
            </div>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🍻 Party Games
          </h1>
          <p className="text-xl text-purple-200">
            TV + Phone multiplayer fun
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transform transition hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isConnected}>
              Create Lobby
            </button>

            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transform transition hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isConnected}>
              Join Lobby
            </button>
          </div>

          {isDev && (
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-purple-200 text-center mb-4">
                Developer Testing:
              </p>
              
              {/* Ping Test Button */}
              <div className="mb-4">
                <button
                  onClick={handlePingTest}
                  disabled={!isConnected || isTesting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transform transition hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTesting ? 'Testing...' : 'Test Ping/Pong'}
                </button>
              </div>

              {/* Debug Info */}
              {socketId && (
                <div className="mb-4 p-3 bg-black/20 rounded-lg">
                  <p className="text-xs text-purple-300 font-mono">
                    Socket ID: {socketId}
                  </p>
                </div>
              )}

              {/* Route Links */}
              <div className="flex gap-4 justify-center">
                <Link
                  to="/display"
                  className="text-purple-300 hover:text-white underline text-sm"
                >
                  Display Route
                </Link>
                <Link
                  to="/controller"
                  className="text-purple-300 hover:text-white underline text-sm"
                >
                  Controller Route
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-purple-300 text-sm space-y-1">
          <p>Story 1.1: Project Setup Complete ✓</p>
          <p>Story 1.2: WebSocket Connection {isConnected ? '✓' : '⏳'}</p>
        </div>
      </div>
    </div>
  )
}
