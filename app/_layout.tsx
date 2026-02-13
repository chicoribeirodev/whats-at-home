import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { createContext, useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export const AppContext = createContext({
  barcodes: [],
  openRecipe: null,
  setBarcodes: (barcodes: string[]) => { },
  setOpenRecipe: (recipe: any) => { }
});

export default function RootLayout() {
  const [barcodes, setBarcodes] = useState([]);
  const [openRecipe, setOpenRecipe] = useState(null);
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppContext.Provider value={{ barcodes, setBarcodes, openRecipe, setOpenRecipe }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="barcode-scanner" options={{ title: 'Scan Barcode' }} />
          <Stack.Screen name="instructions" options={{ title: 'Instructions' }} />
        </Stack>
      </AppContext.Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
