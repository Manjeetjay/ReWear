import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Profile = {
  id: string
  full_name?: string
  email?: string
  points_balance: number
  role: string
  created_at: string
  updated_at: string
}

export type Item = {
  id: string
  user_id: string
  title: string
  description?: string
  category: string
  type: string
  size: string
  condition: string
  tags: string[]
  images: string[]
  status: 'pending' | 'approved' | 'rejected' | 'swapped'
  points_value: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type Swap = {
  id: string
  requester_id: string
  owner_id: string
  item_id: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  type: 'direct_swap' | 'points_redemption'
  points_used: number
  created_at: string
  updated_at: string
  items?: Item
  requester?: Profile
  owner?: Profile
}