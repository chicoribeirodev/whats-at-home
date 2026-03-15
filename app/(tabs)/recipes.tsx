import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { generateRecipesOutputSchema, generateRecipesPrompt } from '@/constants/prompts';
import { aiClient, MODEL } from '@/lib/open-ai-client';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppContext } from '../_layout';

export default function Recipes() {
  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // UI states
  const [addManuallyEnabled, setAddManuallyEnabled] = useState(false);
  const [addManualInput, setAddManualInput] = useState({ name: '', quantity: '', unit: '' });

  const { barcodes, setOpenRecipe } = useContext(AppContext);

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
      model: MODEL,
      input: generateRecipesPrompt(products),
      text: generateRecipesOutputSchema as any,
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

  const handleAddManualProduct = () => {
    if (!addManualInput.name && !addManualInput.quantity && !addManualInput.unit) return;
    const newProduct = {
      name: addManualInput.name,
      quantity: addManualInput.quantity,
      unit: addManualInput.unit,
      barcode: `manual-${Date.now()}`
    };
    setProducts(prev => [...prev, newProduct]);
    setAddManualInput({ name: '', quantity: '', unit: '' });
    setAddManuallyEnabled(false);
  }

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
        <ThemedText type="title">Recipes</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="defaultSemiBold">Generate your recipes based on the products you have.</ThemedText>
        <Pressable style={styles.cameraButton} onPress={() => router.push('/barcode-scanner')}>
          <ThemedText style={styles.cameraButtonText}>📷 Scan product barcodes</ThemedText>
        </Pressable>
        <Pressable style={styles.cameraButton} onPress={() => { }}>
          <ThemedText style={styles.cameraButtonText}>🖼️ Detect products from image</ThemedText>
        </Pressable>
        <Pressable style={styles.cameraButton} onPress={() => setAddManuallyEnabled(!addManuallyEnabled)}>
          <ThemedText style={styles.cameraButtonText}>➕ Manual Add</ThemedText>
        </Pressable>
        {barcodes.length > 0 && <ThemedText>
          Detected barcodes: {barcodes.map(barcode => barcode).join(', ')}
        </ThemedText>}
        {addManuallyEnabled && (
          <View style={styles.stepContainer}>
            <ThemedText type="defaultSemiBold">Add product manually:</ThemedText>
            <TextInput
              placeholder="Product name"
              value={addManualInput.name}
              onChangeText={(text) => setAddManualInput(prev => ({ ...prev, name: text }))}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 }}
            />
            <TextInput
              placeholder="Quantity"
              value={addManualInput.quantity}
              onChangeText={(text) => setAddManualInput(prev => ({ ...prev, quantity: text }))}
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginTop: 8 }}
            />
            <TextInput
              placeholder="Unit (e.g. g, ml)"
              value={addManualInput.unit}
              onChangeText={(text) => setAddManualInput(prev => ({ ...prev, unit: text }))}
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginTop: 8 }}
            />
            <Pressable style={styles.cameraButton} onPress={handleAddManualProduct}>
              <ThemedText style={styles.cameraButtonText}>Add Product</ThemedText>
            </Pressable>
          </View>
        )}
        <View style={styles.productsGrid}>
          {products.map((product, index) => (
            <ThemedView key={index} style={styles.productCard}>
              <ThemedText type="subtitle">{product.name}</ThemedText>
              {product.imageUrl ? (
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.productImage}
                />
              ) : null}
              <ThemedText>
                Quantity: {product.quantity} {product.unit}
              </ThemedText>
            </ThemedView>
          ))}
        </View>
        {products.length > 0 && <Pressable style={styles.cameraButton} onPress={getRecipes}>
          <ThemedText style={styles.cameraButtonText}>Get recipes</ThemedText>
        </Pressable>}
        {loadingRecipes && <ThemedText>Loading recipes...</ThemedText>}
        {recipes.map((recipe, index) => (
          <ThemedView key={index} style={{ marginTop: 16 }}>
            <ThemedText type="title">{recipe.title}</ThemedText>
            <ThemedText type="default">{recipe.description}</ThemedText>
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Ingredients:</ThemedText>
            {recipe.ingredients.map((ingredient: any, idx: number) => (
              <ThemedText key={idx} type="default">- {ingredient.quantity} {ingredient.unit} {ingredient.name}</ThemedText>
            ))}
            {recipe?.if_you_also_have.length > 0 && (<>
              <ThemedText type="subtitle" style={{ marginTop: 8 }}>If you also have:</ThemedText>
              {recipe.if_you_also_have.map((ingredient: string, idx: number) => (
                <ThemedText key={`if-you-also-have-${idx}`} type="default">- {ingredient}</ThemedText>
              ))}
            </>
            )}
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Difficulty: {recipe.difficulty}</ThemedText>
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Time to make: {recipe.time_to_make_minutes} minutes</ThemedText>
            <ThemedText type="subtitle" style={{ marginTop: 8 }}>Best time of day: {recipe.time_of_day}</ThemedText>
            <Pressable style={styles.recipeButton} onPress={() => {
              setOpenRecipe(recipe);
              router.push('/recipe');
            }}>
              <ThemedText style={styles.recipeButtonText}>View Instructions</ThemedText>
            </Pressable>
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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productCard: {
    width: '48%',
    marginTop: 12,
  },
  productImage: {
    width: '100%',
    height: 100,
    marginTop: 4,
    borderRadius: 6,
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
  recipeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  recipeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
