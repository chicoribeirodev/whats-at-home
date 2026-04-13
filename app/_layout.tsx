import { getAllRecipes, getLoggedInUserId, getShoppingList, getUserRemote, initDatabase } from '@/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
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
  const [state, setState] = useState("Initializing...");

  const [user, setUser] = useState<User | null>(null);
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([] /* EXAMPLE_SHOPPING_LIST */);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const init = async () => {
      try {
        setState('Initializing database...');
        await initDatabase();

        console.log('Database initialized');

        setState('Checking for logged in user...');
        const loggedInUser = await getLoggedInUserId();

        if (!loggedInUser) {
          setState('No logged in user');
          return;
        }

        const user = await getUserRemote(loggedInUser);
        setUser(user);
      } catch (error) {
        console.error('Init error:', error);

        if (error instanceof Error) {
          setState(error.message);
        } else {
          setState(String(error));
        }
      }
    };

    init();
  }, []);

  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        console.log('Fetching saved recipes from database...');
        setState('Loading saved recipes...');
        const recipes = await getAllRecipes();
        setSavedRecipes(recipes as Recipe[]);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
        setState('Error loading saved recipes');
      }
    };

    const loadShoppingList = async () => {
      try {
        console.log('Fetching shopping list from database...');
        setState('Loading shopping list...');
        const items = await getShoppingList();
        setShoppingList(items as ShoppingListItem[]);
      } catch (error) {
        console.error('Error fetching shopping list:', error);
        setState('Error loading shopping list');
      }
    };

    const loadData = async () => {
      if (!!user) {
        setState(`User ${user.name} logged in, loading data...`);
        await loadSavedRecipes();
        await loadShoppingList();
      }
    };

    loadData();
  }, [JSON.stringify(user)]);

  const isLoggedIn = !!user;

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
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="barcode-scanner" options={{ title: 'Scan Barcode' }} />
            <Stack.Screen name="recipe" options={{ title: 'Recipe Details' }} />
            <Stack.Screen name="generate-recipes" options={{ title: 'Generate Recipes' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          </Stack.Protected>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="login" options={{
              title: 'Login', header: () => <View style={{ paddingTop: 45, paddingHorizontal: 16, paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 20, fontWeight: '600' }}>Login</Text>
                  <Text style={{ fontSize: 13 }}>{state}</Text>
                </View>
              </View>
            }} />
          </Stack.Protected>
        </Stack>
      </AppContext.Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
