import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Recycle, ArrowRight, Shirt, Star, Users, Leaf } from 'lucide-react'
import { supabase, Item } from '../lib/supabase'
import { ItemCard } from '../components/ItemCard'

export function LandingPage() {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedItems()
  }, [])

  const fetchFeaturedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            full_name
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setFeaturedItems(data || [])
    } catch (error) {
      console.error('Error fetching featured items:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sustainable Fashion
                <span className="text-emerald-600 block">Starts Here</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Join our community of conscious fashion lovers. Exchange, swap, and discover 
                unique clothing while reducing textile waste and building a more sustainable wardrobe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors group"
                >
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/browse"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Browse Items
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Shirt className="h-12 w-12 text-emerald-600 mb-4" />
                    <h3 className="font-semibold text-gray-900">Quality Items</h3>
                    <p className="text-gray-600 text-sm mt-2">Curated clothing in excellent condition</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Users className="h-12 w-12 text-amber-500 mb-4" />
                    <h3 className="font-semibold text-gray-900">Community</h3>
                    <p className="text-gray-600 text-sm mt-2">Connect with like-minded fashion lovers</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Star className="h-12 w-12 text-yellow-500 mb-4" />
                    <h3 className="font-semibold text-gray-900">Points System</h3>
                    <p className="text-gray-600 text-sm mt-2">Earn points for listing and redeem for items</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Leaf className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="font-semibold text-gray-900">Sustainable</h3>
                    <p className="text-gray-600 text-sm mt-2">Reduce waste and environmental impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">500+</div>
              <div className="text-gray-600 mt-2">Items Exchanged</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">200+</div>
              <div className="text-gray-600 mt-2">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">150+</div>
              <div className="text-gray-600 mt-2">Completed Swaps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">2000kg</div>
              <div className="text-gray-600 mt-2">Waste Prevented</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover amazing clothing pieces from our community. Each item is carefully reviewed 
              to ensure quality and authenticity.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/browse"
              className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
            >
              View All Items
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How ReWear Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our sustainable fashion community in three simple steps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">List Your Items</h3>
              <p className="text-gray-600">
                Upload photos and details of clothing items you no longer wear. 
                Earn points for each approved listing.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse & Request</h3>
              <p className="text-gray-600">
                Discover unique pieces from our community. Request direct swaps 
                or use points to redeem items you love.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Swap & Enjoy</h3>
              <p className="text-gray-600">
                Complete the exchange and enjoy your new-to-you clothing while 
                contributing to a more sustainable future.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of fashion-conscious individuals making a positive impact 
            on the environment, one swap at a time.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Join ReWear Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}