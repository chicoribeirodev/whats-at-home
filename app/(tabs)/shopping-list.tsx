import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppContext } from '../_layout';

export default function ShoppingList() {
  const { shoppingList } = useContext(AppContext);

  const totalPrice = shoppingList.reduce((sum, item) => sum + item.total_price_eur, 0).toFixed(2);

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
        <ThemedText type="title">Shopping List</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {shoppingList.length === 0 ? (
          <ThemedText type="defaultSemiBold">Your shopping list is empty. Generate meal plans to populate it.</ThemedText>
        ) : (
          <>
            <ThemedText type="defaultSemiBold">Estimated cost of your shopping list: {totalPrice}€</ThemedText>
            <ThemedText type="defaultSemiBold">Items:</ThemedText>
            {shoppingList.map((item, index) => (
              <ThemedView key={index} style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
                <ThemedText type="subtitle">{item.name}</ThemedText>
                <ThemedText>Quantity: {item.quantity} {item.unit}</ThemedText>
                <ThemedText>Category: {item.category}</ThemedText>
                <ThemedText>Unit Price: €{item.unit_price_eur.toFixed(2)}</ThemedText>
                <ThemedText>Total Price: €{item.total_price_eur.toFixed(2)}</ThemedText>
              </ThemedView>
            ))}
            <Pressable style={styles.cameraButton} onPress={() => { }}>
              <ThemedText style={styles.cameraButtonText}>🏠 Order Items</ThemedText>
            </Pressable>
          </>
        )}
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
  inputElement: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
});
