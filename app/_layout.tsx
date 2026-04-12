import { getAllRecipes, getLoggedInUserId, getShoppingList, getUserRemote, initDatabase } from '@/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export type User = {
  id: number;
  name: string;
  email: string;
  language: string;
  dietary_preferences: string[];
  created_at: string;
  updated_at: string;
  related_users?: User[];
}

export type Recipe = {
  id: number;
  title: string;
  description: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  instructions: string[];
  difficulty: string;
  time_to_make_minutes: number;
  calories: number;
  calories_unit: string;
  time_of_day?: string;
  type_of_meal?: string;
  if_you_also_have?: string[];
}

export type ShoppingListItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  unit_price_eur: number;
  total_price_eur: number;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  barcodes: string[];
  setBarcodes: (barcodes: string[]) => void;
  shoppingList: ShoppingListItem[];
  setShoppingList: (items: ShoppingListItem[]) => void;
  savedRecipes: Recipe[];
  setSavedRecipes: (recipes: Recipe[]) => void;
  openRecipe: Recipe | null;
  setOpenRecipe: (recipe: Recipe | null) => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  barcodes: [],
  openRecipe: null,
  savedRecipes: [],
  shoppingList: [],
  setUser: (user: User | null) => { },
  setBarcodes: (barcodes: string[]) => { },
  setSavedRecipes: (recipes: Recipe[]) => { },
  setOpenRecipe: (recipe: Recipe | null) => { },
  setShoppingList: (items: ShoppingListItem[]) => { },
});

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([] /* EXAMPLE_SHOPPING_LIST */);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const initDB = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully!');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    const loadSavedRecipes = async () => {
      try {
        console.log('Fetching saved recipes from database...');
        const recipes = await getAllRecipes();
        setSavedRecipes(recipes as Recipe[]);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    const loadShoppingList = async () => {
      try {
        console.log('Fetching shopping list from database...');
        const items = await getShoppingList();
        setShoppingList(items as ShoppingListItem[]);
      } catch (error) {
        console.error('Error fetching shopping list:', error);
      }
    };

    initDB();
    loadSavedRecipes();
    loadShoppingList();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getLoggedInUserId();
        if (!loggedInUser) {
          console.log('No logged in user found in local database.');
          return;
        }
        console.log(`Logged in user ID from local database: ${loggedInUser}`);
        const user = await getUserRemote(loggedInUser);
        console.log('Fetched user from remote database:', user);
        setUser(user);
      } catch (error) {
        console.error('Error fetching user from remote database:', error);
      }
    };

    fetchUser();
  }, [user?.id]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppContext.Provider value={{
        user,
        barcodes,
        setBarcodes,
        openRecipe,
        setUser,
        setOpenRecipe,
        shoppingList,
        setShoppingList,
        savedRecipes,
        setSavedRecipes
      }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="barcode-scanner" options={{ title: 'Scan Barcode' }} />
          <Stack.Screen name="recipe" options={{ title: 'Recipe Details' }} />
          <Stack.Screen name="generate-recipes" options={{ title: 'Generate Recipes' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
      </AppContext.Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
