import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, User, Calendar, Tag, ArrowLeft, Heart } from 'lucide-react'
import { supabase, Item, Swap } from '../lib/supabase'
import { useAuthContext } from '../contexts/AuthContext'
import { format } from 'date-fns'

export function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuthContext()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestLoading, setRequestLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (id) {
      fetchItem()
    }
  }, [id])

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setItem(data)
    } catch (error) {
      console.error('Error fetching item:', error)
      navigate('/browse')
    } finally {
      setLoading(false)
    }
  }

  const handleSwapRequest = async (type: 'direct_swap' | 'points_redemption') => {
    if (!profile || !item) return

    if (type === 'points_redemption' && profile.points_balance < item.points_value) {
      alert('You do not have enough points for this item')
      return
    }

    setRequestLoading(true)
    try {
      const { error } = await supabase
        .from('swaps')
        .insert({
          requester_id: profile.id,
          owner_id: item.user_id,
          item_id: item.id,
          type,
          points_used: type === 'points_redemption' ? item.points_value : 0
        })

      if (error) throw error

      alert('Swap request sent successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating swap request:', error)
      alert('Failed to send swap request')
    } finally {
      setRequestLoading(false)
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800'
      case 'like new':
        return 'bg-blue-100 text-blue-800'
      case 'good':
        return 'bg-yellow-100 text-yellow-800'
      case 'fair':
        return 'bg-orange-100 text-orange-800'
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

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    )
  }

  const isOwner = profile?.id === item.user_id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[selectedImage]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-emerald-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>
                <div className="flex items-center space-x-1 text-emerald-600">
                  <Star className="h-5 w-5" />
                  <span className="font-semibold">{item.points_value} points</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{item.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">{item.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2 font-medium">{item.size}</span>
                </div>
                <div>
                  <span className="text-gray-600">Listed:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(item.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              {item.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Listed by</h3>
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.profiles?.full_name}</p>
                  <p className="text-sm text-gray-600">Community Member</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner && profile && item.status === 'approved' && (
              <div className="space-y-3">
                <button
                  onClick={() => handleSwapRequest('points_redemption')}
                  disabled={requestLoading || profile.points_balance < item.points_value}
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {requestLoading ? 'Sending Request...' : `Redeem with ${item.points_value} Points`}
                </button>

                <button
                  onClick={() => handleSwapRequest('direct_swap')}
                  disabled={requestLoading}
                  className="w-full border-2 border-emerald-600 text-emerald-600 py-3 px-6 rounded-lg font-semibold hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {requestLoading ? 'Sending Request...' : 'Request Direct Swap'}
                </button>

                {profile.points_balance < item.points_value && (
                  <p className="text-sm text-amber-600 text-center">
                    You need {item.points_value - profile.points_balance} more points to redeem this item
                  </p>
                )}
              </div>
            )}

            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">This is your item</p>
                <p className="text-blue-600 text-sm mt-1">
                  You can manage this item from your dashboard
                </p>
              </div>
            )}

            {item.status !== 'approved' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">
                  This item is {item.status} and not available for swapping
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}