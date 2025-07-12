import React from 'react'
import { Link } from 'react-router-dom'
import { Item } from '../lib/supabase'
import { Star, Tag } from 'lucide-react'

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
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

  return (
    <Link to={`/item/${item.id}`} className="group block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="aspect-square bg-gray-200 relative overflow-hidden">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
              {item.condition}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {item.category} • {item.type} • Size {item.size}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-1 text-emerald-600">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">{item.points_value} points</span>
            </div>
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex space-x-1">
                {item.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 2 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    +{item.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}