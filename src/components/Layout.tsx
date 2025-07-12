import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Recycle, User, LogOut, Plus, Home, Grid3X3 } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, signOut } = useAuthContext()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Recycle className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">ReWear</span>
            </Link>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/browse"
                    className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <Grid3X3 className="h-5 w-5" />
                    <span>Browse</span>
                  </Link>
                  <Link
                    to="/add-item"
                    className="flex items-center space-x-1 bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>List Item</span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{profile?.full_name}</div>
                      <div className="text-emerald-600">{profile?.points_balance} points</div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-emerald-600 px-3 py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  )
}