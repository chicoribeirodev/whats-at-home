import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useEffect, useState } from 'react';
import ScanbotBarcodeSDK, {
  BarcodeScannerScreenConfiguration,
} from 'react-native-scanbot-barcode-scanner-sdk';

const startBarcodeScanner = async () => {
  const config = new BarcodeScannerScreenConfiguration();
  const result = await ScanbotBarcodeSDK.startBarcodeScanner(config);
  console.log('Barcode Scanner Result:', result);
}

export default function HomeScreen() {
  const [barcodes, setBarcodes] = useState([
    "5600499545911"
  ]);

  const [products, setProducts] = useState<any[]>([]);

  const getProductInfo = async (barcode: string) => {
    console.log('Fetching product info for barcode:', barcode);

    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 1) {
          console.log('Product info:', data.product);
          const product = {
            name: data.product.product_name,
            imageUrl: data.product.image_front_small_url,
            quantity: data.product.product_quantity,
            unit: data.product.product_quantity_unit,
          }

          setProducts(prevProducts => [...prevProducts, product]);
        } else {
          console.log('Product not found for barcode:', barcode);
        }
      })
      .catch(error => {
        console.error('Error fetching product info:', error);
      });
  }

  useEffect(() => {
    barcodes.forEach(barcode => {
      getProductInfo(barcode);
    });
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
        {barcodes.map((barcode) => (
          <ThemedText key={barcode}>
            Detected barcode: {barcode}
          </ThemedText>
        ))}
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
