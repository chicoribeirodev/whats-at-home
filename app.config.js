import 'dotenv/config';

export default {
  expo: {
    name: "whats-at-home",
    slug: "whats-at-home",
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};