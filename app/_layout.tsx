import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { createContext, useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
  difficulty: string;
  time_to_make_minutes: number;
  time_of_day: string;
  calories: number;
  calories_unit: string;
  if_you_also_have?: string[];
}

type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: string;
  category: string;
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
  setBarcodes: (barcodes: string[]) => { },
  setSavedRecipes: (recipes: Recipe[]) => { },
  setOpenRecipe: (recipe: any) => { }
});

export default function RootLayout() {
  const [barcodes, setBarcodes] = useState([]);
  const [openRecipe, setOpenRecipe] = useState(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppContext.Provider value={{ barcodes, setBarcodes, openRecipe, setOpenRecipe, shoppingList, setShoppingList }}>
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
