import 'dotenv/config';

export default {
  expo: {
    name: "whats-at-home",
    slug: "whats-at-home",
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "41eed555-2d67-4739-a674-c3bb9912ff7f"
      }
    },
  },
};