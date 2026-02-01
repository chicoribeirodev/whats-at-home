import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import OpenAI from "openai";
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import ScanbotBarcodeSDK, {
  BarcodeScannerScreenConfiguration,
} from 'react-native-scanbot-barcode-scanner-sdk';

const aiClient = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY
});

const startBarcodeScanner = async () => {
  const config = new BarcodeScannerScreenConfiguration();
  const result = await ScanbotBarcodeSDK.startBarcodeScanner(config);
  console.log('Barcode Scanner Result:', result);
}

export default function HomeScreen() {
  const [barcodes, setBarcodes] = useState([
    "5600499545911",
    "3596710547623",
    "7394376616709"
  ]);
  const [products, setProducts] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

  const getProductInfo = async (barcode: string) => {
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      if (!res.ok) {
        console.warn('Product fetch failed', res.status);
        return null;
      }
      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        console.warn('Unexpected content-type', contentType);
        return null;
      }
      const data = await res.json();
      if (data.status === 1) {
        return {
          name: data.product.product_name,
          imageUrl: data.product.image_front_small_url,
          quantity: data.product.product_quantity,
          unit: data.product.product_quantity_unit,
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching product info:', err);
      return null;
    }
  };

  const getRecipes = async () => {
    const response = await aiClient.responses.create({
      model: "gpt-4.1-mini",
      input: `Generate a list of 3 simple recipes using the following ingredients: ${products.map(p => `${p.name} ${p.quantity} ${p.unit}`).join(", ")
        }`,
      text: {
        format: {
          name: "recipes",
          type: "json_schema",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              recipes: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    ingredients: {
                      type: "array",
                      items: { type: "string" }
                    },
                    instructions: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["title", "ingredients", "instructions"]
                },
              }
            },
            required: ["recipes"]
          }
        }
      }
    });


    const data = response.output_text ? JSON.parse(response.output_text) : {};

    setRecipes(data?.recipes || []);
  }

  useEffect(() => {
    const fetchBarcodes = async () => {
      const products = await Promise.all(barcodes.map(getProductInfo));
      setProducts(products.filter(Boolean));
    };

    fetchBarcodes();
  }, [barcodes?.length]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">What's at Home!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Pressable style={styles.cameraButton} onPress={startBarcodeScanner}>
          <ThemedText style={styles.cameraButtonText}>📷 Scan your products</ThemedText>
        </Pressable>
        <ThemedText>
          Detected barcodes: {barcodes.map((barcode) => barcode).join(', ')}
        </ThemedText>
        {products.map((product, index) => (
          <ThemedView key={index} style={{ marginTop: 12 }}>
            <ThemedText type="subtitle">{product.name}</ThemedText>
            {product.imageUrl ? (
              <Image
                source={{ uri: product.imageUrl }}
                style={{ width: 100, height: 100, marginTop: 4 }}
              />
            ) : null}
            <ThemedText>
              Quantity: {product.quantity} {product.unit}
            </ThemedText>
          </ThemedView>
        ))}
        <Pressable style={styles.cameraButton} onPress={getRecipes}>
          <ThemedText style={styles.cameraButtonText}>Get recipes</ThemedText>
        </Pressable>
        {recipes.map((recipe, index) => (
          <ThemedView key={index} style={{ marginTop: 16 }}>
            <ThemedText type="title">{recipe.title}</ThemedText>
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Ingredients:</ThemedText>
            {recipe.ingredients.map((ingredient: string, idx: number) => (
              <ThemedText key={idx}>- {ingredient}</ThemedText>
            ))}
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Instructions:</ThemedText>
            {recipe.instructions.map((instruction: string, idx: number) => (
              <ThemedText key={idx}>{idx + 1}. {instruction}</ThemedText>
            ))}
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
