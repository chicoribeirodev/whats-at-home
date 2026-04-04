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

  const { data: userRelated, error: relatedError } = await supabase
    .from('user_relationships')
    .select('*')
    .eq('user_id', userId)

  console.log('Fetched user-related data from remote database:', userRelated)

  if (relatedError) {
    console.error('Error fetching user-related data:', relatedError)
  }

  if (userRelated && userRelated.length > 0) {
    const relatedIds = userRelated.map(rel => rel.related_user_id)
    const { data: relatedUsers, error: relatedUsersError } = await supabase
      .from('user')
      .select('*')
      .in('id', relatedIds)

    console.log('Fetched related users from remote database:', relatedUsers)

    if (relatedUsersError) {
      console.error('Error fetching related users:', relatedUsersError)
    }

    return { ...data, related_users: relatedUsers }
  }

  return { ...data }
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