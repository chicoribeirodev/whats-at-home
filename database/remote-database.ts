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

export const getUserById = async (userId: string) => {
  const { data, error } = await supabase.from('user').select('*').eq('id', userId).single()
  if (error) {
    console.error('Error fetching user:', error)
    return null
  }
  return data
}

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase.from('user').select('*').eq('email', email).single()
  if (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
  return data
}

export const getUserRemote = async (userId: string) => {
  const { data, error } = await supabase.from('user').select('*').eq('id', userId).single()
  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  console.dir(data, { depth: null });

  const userGroups = await getUserGroupsRemote(userId);

  console.log('Fetched user groups:', userGroups);

  if (userGroups.length > 0) {
    data.related_users = [];

    for (const group of userGroups) {
      const groupUsers = await getGroupUsersRemote(group.group_id);

      console.log(`Fetched users for group ${group.group_id}:`, groupUsers);

      for (const groupUser of groupUsers) {
        if (groupUser.user_id !== userId) {

          console.log(`Fetching related user with ID ${groupUser.user_id}...`);
          const relatedUser = await getUserById(groupUser.user_id);

          if (relatedUser) {
            data.related_users.push(relatedUser);
          }
        }
      }
    }
  }

  return data;
}

export const getUserGroupsRemote = async (userId: string) => {
  console.log(`Fetching groups for user ${userId} from remote database...`);
  const { data, error } = await supabase.from('user_groups').select("group_id").eq('user_id', userId);

  if (error) {
    console.error('Error fetching user groups:', error)
    return []
  }

  return data
}

export const getGroupUsersRemote = async (groupId: string) => {
  console.log(`Fetching users for group ${groupId} from remote database...`);
  const { data, error } = await supabase.from('user_groups').select("user_id").eq('group_id', groupId);

  if (error) {
    console.error('Error fetching group users:', error)
    return []
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