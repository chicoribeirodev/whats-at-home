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
    if (!userId) {
      throw new Error('getUserRemote: userId is missing');
    }

    if (!supabase) {
      throw new Error('getUserRemote: supabase client is undefined');
    }

    const fromFn = (supabase as any).from;
    if (typeof fromFn !== 'function') {
      throw new Error('getUserRemote: supabase.from is not a function');
    }

    const query = supabase.from('user');
    if (!query) {
      throw new Error('getUserRemote: supabase.from("user") returned undefined');
    }

    const selectFn = (query as any).select;
    if (typeof selectFn !== 'function') {
      throw new Error('getUserRemote: select is not a function');
    }

    const { data, error } = await query.select('*').eq('id', userId).single();

    if (error) {
      throw new Error(`getUserRemote: fetch user failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('getUserRemote: user not found');
    }

    if (typeof getUserGroupsRemote !== 'function') {
      throw new Error('getUserRemote: getUserGroupsRemote is not a function');
    }

    let userGroups: any[] = [];
    try {
      userGroups = await getUserGroupsRemote(userId);
    } catch (err) {
      throw new Error(
        `getUserRemote: getUserGroupsRemote crashed: ${err instanceof Error ? err.message : String(err)
        }`
      );
    }

    data.related_users = [];

    for (const group of userGroups) {
      if (!group?.group_id) {
        throw new Error('getUserRemote: group.group_id missing');
      }

      if (typeof getGroupUsersRemote !== 'function') {
        throw new Error('getUserRemote: getGroupUsersRemote is not a function');
      }

      let groupUsers: any[] = [];

      try {
        groupUsers = await getGroupUsersRemote(group.group_id);
      } catch (err) {
        throw new Error(
          `getUserRemote: getGroupUsersRemote crashed for ${group.group_id}: ${err instanceof Error ? err.message : String(err)
          }`
        );
      }

      for (const groupUser of groupUsers) {
        if (!groupUser?.user_id) {
          throw new Error('getUserRemote: groupUser.user_id missing');
        }

        if (groupUser.user_id !== userId) {
          if (typeof getUserById !== 'function') {
            throw new Error('getUserRemote: getUserById is not a function');
          }

          let relatedUser = null;

          try {
            relatedUser = await getUserById(groupUser.user_id);
          } catch (err) {
            throw new Error(
              `getUserRemote: getUserById crashed for ${groupUser.user_id}: ${err instanceof Error ? err.message : String(err)
              }`
            );
          }

          if (relatedUser) {
            data.related_users.push(relatedUser);
          }
        }
      }
    }

    return data;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : `getUserRemote unknown error: ${String(err)}`
    );
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