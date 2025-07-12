import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Eye, Users, Package, Activity } from 'lucide-react'
import { supabase, Item, Profile } from '../lib/supabase'
import { useAuthContext } from '../contexts/AuthContext'

export function AdminPanel() {
  const { profile } = useAuthContext()
  const navigate = useNavigate()
  const [pendingItems, setPendingItems] = useState<Item[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingItems: 0,
    completedSwaps: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchAdminData()
  }, [profile, navigate])

  const fetchAdminData = async () => {
    try {
      // Fetch pending items
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (itemsError) throw itemsError

      // Fetch users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Fetch stats
      const [usersCount, itemsCount, pendingCount, swapsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('items').select('id', { count: 'exact' }),
        supabase.from('items').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('swaps').select('id', { count: 'exact' }).eq('status', 'completed')
      ])

      setPendingItems(items || [])
      setUsers(profiles || [])
      setStats({
        totalUsers: usersCount.count || 0,
        totalItems: itemsCount.count || 0,
        pendingItems: pendingCount.count || 0,
        completedSwaps: swapsCount.count || 0
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleItemAction = async (itemId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ status: action })
        .eq('id', itemId)

      if (error) throw error

      // Remove from pending list
      setPendingItems(pendingItems.filter(item => item.id !== itemId))
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingItems: prev.pendingItems - 1,
        totalItems: action === 'approved' ? prev.totalItems + 1 : prev.totalItems
      }))
    } catch (error) {
      console.error('Error updating item status:', error)
      alert('Failed to update item status')
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage platform content and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalItems}</h3>
                <p className="text-gray-600">Total Items</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{stats.pendingItems}</h3>
                <p className="text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{stats.completedSwaps}</h3>
                <p className="text-gray-600">Completed Swaps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Items Review</h2>

          {pendingItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending items</h3>
              <p className="text-gray-600">All items have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.category} • {item.type} • Size {item.size} • {item.condition}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Listed by: {item.profiles?.full_name} ({item.profiles?.email})
                        </p>
                        {item.description && (
                          <p className="text-gray-700 text-sm mt-2 line-clamp-2">{item.description}</p>
                        )}
                        <p className="text-emerald-600 text-sm font-medium mt-2">
                          {item.points_value} points
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Item"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleItemAction(item.id, 'approved')}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleItemAction(item.id, 'rejected')}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Users</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{user.full_name || 'N/A'}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.points_balance}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}