import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Star, Package, Clock, CheckCircle, Grid3X3 } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'
import { supabase, Item, Swap } from '../lib/supabase'
import { ItemCard } from '../components/ItemCard'

export function Dashboard() {
  const { profile } = useAuthContext()
  const [userItems, setUserItems] = useState<Item[]>([])
  const [userSwaps, setUserSwaps] = useState<Swap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      fetchUserData()
    }
  }, [profile])

  const fetchUserData = async () => {
    try {
      // Fetch user's items
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false })

      if (itemsError) throw itemsError

      // Fetch user's swaps
      const { data: swaps, error: swapsError } = await supabase
        .from('swaps')
        .select(`
          *,
          items (
            id,
            title,
            images
          )
        `)
        .or(`requester_id.eq.${profile!.id},owner_id.eq.${profile!.id}`)
        .order('created_at', { ascending: false })

      if (swapsError) throw swapsError

      setUserItems(items || [])
      setUserSwaps(swaps || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.full_name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your items and track your sustainable fashion journey
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-emerald-600">
                <Star className="h-6 w-6" />
                <span className="text-2xl font-bold">{profile?.points_balance}</span>
              </div>
              <p className="text-sm text-gray-600">Available Points</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/add-item"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Plus className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">List New Item</h3>
                <p className="text-sm text-gray-600">Add clothing to exchange</p>
              </div>
            </div>
          </Link>

          <Link
            to="/browse"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Grid3X3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Browse Items</h3>
                <p className="text-sm text-gray-600">Discover new pieces</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Stats</h3>
                <p className="text-sm text-gray-600">{userItems.length} items listed</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
            <Link
              to="/add-item"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Add New Item
            </Link>
          </div>

          {userItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
              <p className="text-gray-600 mb-6">Start by listing your first item for exchange</p>
              <Link
                to="/add-item"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.slice(0, 6).map((item) => (
                <div key={item.id} className="relative">
                  <ItemCard item={item} />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Swaps */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Swaps</h2>

          {userSwaps.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps yet</h3>
              <p className="text-gray-600">Start browsing items to make your first swap</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userSwaps.slice(0, 5).map((swap) => (
                <div key={swap.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {swap.items?.images && swap.items.images.length > 0 && (
                        <img
                          src={swap.items.images[0]}
                          alt={swap.items.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{swap.items?.title}</h3>
                      <p className="text-sm text-gray-600">
                        {swap.type === 'points_redemption' ? 'Points Redemption' : 'Direct Swap'}
                      </p>
                      {swap.points_used > 0 && (
                        <p className="text-sm text-emerald-600">{swap.points_used} points</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(swap.status)}`}>
                      {swap.status}
                    </span>
                    {swap.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}