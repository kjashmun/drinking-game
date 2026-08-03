import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
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
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transform transition hover:scale-105 shadow-lg">
              Create Lobby
            </button>

            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transform transition hover:scale-105 shadow-lg">
              Join Lobby
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-sm text-purple-200 text-center mb-4">
              Developer Testing Routes:
            </p>
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
        </div>

        <div className="mt-8 text-center text-purple-300 text-sm">
          <p>Story 1.1: Project Setup Complete ✓</p>
        </div>
      </div>
    </div>
  )
}
