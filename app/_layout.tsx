import { getShoppingList, initDatabase, seedDatabase } from '@/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

type Recipe = {
  id?: number;
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

type ShoppingListItem = {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  unit_price_eur: number;
  total_price_eur: number;
}

interface AppContextType {
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
  barcodes: [],
  openRecipe: null,
  savedRecipes: [],
  shoppingList: [],
  setBarcodes: (barcodes: string[]) => { },
  setSavedRecipes: (recipes: Recipe[]) => { },
  setOpenRecipe: (recipe: Recipe | null) => { },
  setShoppingList: (items: ShoppingListItem[]) => { },
});

export default function RootLayout() {
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

    const seedDB = async () => {
      try {
        await seedDatabase();
        console.log('Seeding database with initial data...');
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    }

    const updateShoppingList = async () => {
      try {
        console.log('Fetching shopping list from database...');
        const items = await getShoppingList();
        setShoppingList(items as ShoppingListItem[]);
      } catch (error) {
        console.error('Error fetching shopping list:', error);
      }
    };

    initDB();
    updateShoppingList();

  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppContext.Provider value={{
        barcodes,
        setBarcodes,
        openRecipe,
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
        </Stack>
      </AppContext.Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
