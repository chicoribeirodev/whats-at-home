import { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppContext } from '../_layout';

export default function ShoppingList() {
  const { shoppingList } = useContext(AppContext);

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
        {shoppingList.map((item, index) => (
          <ThemedView key={index} style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <ThemedText type="subtitle">{item.name}</ThemedText>
            <ThemedText>Quantity: {item.quantity} {item.unit}</ThemedText>
            <ThemedText>Category: {item.category}</ThemedText>
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
  inputElement: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
});
