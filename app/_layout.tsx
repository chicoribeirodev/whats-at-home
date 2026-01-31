import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import ScanbotBarcodeSDK from 'react-native-scanbot-barcode-scanner-sdk';

const LICENSE_KEY =
  "M830lD+UCTLzJSE/y4GFLkubb8N0VI" +
  "ldPJVgrS42DFn+MG3ua1uiCArc8vMJ" +
  "yoWw7u93k5S368vymGPi+2uoxkvvwI" +
  "r64XjjVh6O+fOeK1tUTQgAs5m1NdGH" +
  "qan8wEoP0ly0tliHMU46182YKq4txB" +
  "mIDFjql7KdCTPurVHfWTG5tYADXn+S" +
  "d22rRnTg/KQoi2U63Q/NdqYVvgYdkW" +
  "sP8r6Uo+9GnBkicw5gUWsrrERPEAAs" +
  "UFaBlI1nZgUFveWxS6qO3owVL6bEPX" +
  "XnS/OXUYQSaPvpOIPmG2LEbo1bbyOz" +
  "a3lXgUAgCo6S/8XMetKevmbahK+X3H" +
  "l8jdE866OhJw==\nU2NhbmJvdFNESw" +
  "p3aGF0cy1hdC1ob21lCjE3NzA1MDg3" +
  "OTkKODM4ODYwNwoxOQ==\n";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === 'web' || Constants.appOwnership === 'expo') return;

    (async () => {
      try {
        const result = await ScanbotBarcodeSDK.initializeSdk({ licenseKey: LICENSE_KEY });
        console.log('Scanbot initialized', result);
      } catch (err) {
        console.log('Scanbot init error', err);
      }
    })();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
