import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
)

export const getUsersRemote = async () => {
  const { data, error } = await supabase.from('user').select('*')
  if (error) {
    console.error('Error fetching users:', error)
    return []
  }
  return data
}

export const getUserRemote = async (userId: number) => {
  const { data, error } = await supabase.from('user').select('*').eq('id', userId).single()
  if (error) {
    console.error('Error fetching user:', error)
    return null
  }
  return data
}

export const getRecipesRemote = async () => {
  const { data, error } = await supabase.from('recipes').select('*')
  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
  return data
}

export const getShoppingListRemote = async () => {
  const { data, error } = await supabase.from('shopping_list').select('*')
  if (error) {
    console.error('Error fetching shopping list:', error)
    return []
  }
  return data
}