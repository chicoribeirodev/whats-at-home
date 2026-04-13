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
  try {
    const { data, error } = await supabase.from('user').select('*').eq('email', email).single()

    if (error) {
      console.error('Error fetching user by email:', error)
      return null
    }

    const userId = data.id;

    const userGroups = await getUserGroupsRemote(userId).catch(err => {
      console.error('Error fetching user groups:', err);
      return [];
    });

    data.related_users = [];

    for (const group of userGroups) {
      const groupUsers = await getGroupUsersRemote(group.group_id).catch(err => {
        console.error('Error fetching group users:', err);
        return [];
      });

      for (const groupUser of groupUsers) {
        if (groupUser.user_id !== userId) {
          const relatedUser = await getUserById(groupUser.user_id).catch(err => {
            console.error('Error fetching related user:', err);
            return null;
          });

          if (relatedUser) {
            data.related_users.push(relatedUser);
          }
        }
      }
    }

    return data;
  } catch (err) {
    console.error('getUserRemote crashed:', err);
    return null;
  }
}

export const getUserRemote = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('user').select('*').eq('id', userId).single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    const userGroups = await getUserGroupsRemote(userId).catch(err => {
      console.error('Error fetching user groups:', err);
      return [];
    });

    data.related_users = [];

    for (const group of userGroups) {
      const groupUsers = await getGroupUsersRemote(group.group_id).catch(err => {
        console.error('Error fetching group users:', err);
        return [];
      });

      for (const groupUser of groupUsers) {
        if (groupUser.user_id !== userId) {
          const relatedUser = await getUserById(groupUser.user_id).catch(err => {
            console.error('Error fetching related user:', err);
            return null;
          });

          if (relatedUser) {
            data.related_users.push(relatedUser);
          }
        }
      }
    }

    return data;
  } catch (err) {
    console.error('getUserRemote crashed:', err);
    return null;
  }
};

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