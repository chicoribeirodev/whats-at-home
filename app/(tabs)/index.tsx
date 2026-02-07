import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import OpenAI from "openai";
import { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../_layout';

const aiClient = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY
});

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const { barcodes } = useContext(AppContext)

  const getProductInfo = async (barcode: string) => {
    try {
      console.log('Fetching product info for barcode:', barcode);
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
          barcode
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching product info:', err);
      return {
        name: `Unknown product for barcode ${barcode}`,
        barcode
      };
    }
  };

  const getRecipes = async () => {
    console.log('Generating recipes for products:', products);
    setLoadingRecipes(true);

    const response = await aiClient.responses.create({
      model: "gpt-4.1-mini",
      input: `Generate a list of 3 practical recipes using the following ingredients: ${products.map(p => `${p.name} ${p.quantity} ${p.unit}`).join(", ")}.
        These recipes should only include the provided ingredients and should be able to make at home.
        You can assume basic pantry staples like salt, pepper, oil, olive oil, onion and garlic are available for cooking, but they don't need to be included in the recipes mandatorily, only if they make sense to be included.
        These recipes should be useful and make sense given the provided ingredients. 
        They don't need to include all the ingredients, but try to use as many as possible.
        Consider at least one simple recipe.
        Try to keep the recipes as simple and easy to make as possible, but it's ok to provide one harder recipe if it makes good use of the ingredients.
        `,
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
                    },
                    difficulty: { type: "string" },
                    time_to_make_minutes: { type: "number" },
                    time_of_day: { type: "string" },
                  },
                  required: ["title", "ingredients", "instructions", "difficulty", "time_to_make_minutes", "time_of_day"]
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
    setLoadingRecipes(false);
  }

  useEffect(() => {
    console.log('Barcodes changed:', barcodes);
    const fetchBarcodes = async () => {
      const newBarcodes: string[] = barcodes.filter(barcode => !products.some((p) => p && p.barcode === barcode));
      const newProducts = await Promise.all(newBarcodes.map(getProductInfo));
      console.log('Fetched products for new barcodes:', newBarcodes, newProducts.map(p => p?.name));
      setProducts(prev => [...prev, ...newProducts.filter(Boolean)]);
    };

    fetchBarcodes();
  }, [barcodes?.length]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: 50,
        paddingHorizontal: 16,
        minHeight: '100%',
        gap: 16,
        backgroundColor: "white",
      }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">What's at Home</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="default">Welcome to What's at Home! To get started, please scan your products.</ThemedText>
        <Pressable style={styles.cameraButton} onPress={() => router.push('/barcode-scanner')}>
          <ThemedText style={styles.cameraButtonText}>📷 Scan your products</ThemedText>
        </Pressable>
        {barcodes.length > 0 && <ThemedText>
          Detected barcodes: {barcodes.map(barcode => barcode).join(', ')}
        </ThemedText>}
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
        {products.length > 0 && <Pressable style={styles.cameraButton} onPress={getRecipes}>
          <ThemedText style={styles.cameraButtonText}>Get recipes</ThemedText>
        </Pressable>}
        {loadingRecipes && <ThemedText>Loading recipes...</ThemedText>}
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
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Difficulty: {recipe.difficulty}</ThemedText>
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Time to make: {recipe.time_to_make_minutes} minutes</ThemedText>
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Best time of day: {recipe.time_of_day}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
