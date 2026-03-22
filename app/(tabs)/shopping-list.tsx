import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Picker } from '@react-native-picker/picker';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppContext } from '../_layout';

export default function ShoppingList() {
  const [addManuallyEnabled, setAddManuallyEnabled] = useState(false);
  const [addManualInput, setAddManualInput] = useState({ name: '', quantity: '', unit: '' });
  const [orderBy, setOrderBy] = useState('name');
  const { shoppingList, setShoppingList } = useContext(AppContext);

  const totalPrice = shoppingList.reduce((sum, item) => sum + item.total_price_eur, 0).toFixed(2);

  const removeItemFromShoppingList = (item: any) => {
    const updatedList = shoppingList.filter((i) => i !== item);
    setShoppingList(updatedList);
  };

  const addItemToShoppingList = (item: any) => {
    console.log('Adding item to shopping list:', item);
    /* setAddManualInput({ name: '', quantity: '', unit: '' });
    setShoppingList([...shoppingList, item]); */
  };

  const sortedShoppingList = [...shoppingList].sort((a, b) => {
    if (orderBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (orderBy === 'category') {
      return a.category.localeCompare(b.category);
    } else if (orderBy === 'price') {
      return b.total_price_eur - a.total_price_eur;
    }
    return 0;
  });

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
        <Pressable style={styles.cameraButton} onPress={() => setAddManuallyEnabled(!addManuallyEnabled)}>
          <ThemedText style={styles.cameraButtonText}>➕ Manual Add</ThemedText>
        </Pressable>
        {addManuallyEnabled && (
          <View style={styles.stepContainer}>
            <ThemedText type="defaultSemiBold">Add items manually:</ThemedText>
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
            <Pressable style={styles.cameraButton} onPress={() => addItemToShoppingList(addManualInput)}>
              <ThemedText style={styles.cameraButtonText}>Add Product</ThemedText>
            </Pressable>
          </View>
        )}
        {shoppingList.length === 0 ? (
          <ThemedText type="defaultSemiBold">Your shopping list is empty. Generate meal plans to populate it or add items manually.</ThemedText>
        ) : (
          <>
            <ThemedText type="defaultSemiBold">Estimated cost of your shopping list: {totalPrice}€</ThemedText>
            <ThemedText type="defaultSemiBold">Order by:</ThemedText>
            <Picker
              selectedValue={orderBy}
              onValueChange={(value) => setOrderBy(value)}
            >
              <Picker.Item label="Name" value="name" />
              <Picker.Item label="Category" value="category" />
              <Picker.Item label="Price" value="price" />
            </Picker>
            {sortedShoppingList.map((item, index) => (
              <ThemedView key={index} style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
                <ThemedText type="subtitle">{item.name}</ThemedText>
                <ThemedText>Quantity: {item.quantity} {item.unit}</ThemedText>
                <ThemedText>Category: {item.category}</ThemedText>
                <ThemedText>Price: €{item.total_price_eur.toFixed(2)} (unit: €{item.unit_price_eur.toFixed(2)})</ThemedText>
                <View style={{ flexDirection: 'row', marginBottom: 8, gap: 8, justifyContent: 'flex-end' }}>
                  <View>
                    <Text style={{ textDecorationLine: 'underline' }}>modify</Text>
                  </View>
                  <View>
                    <Text style={{ textDecorationLine: 'underline' }} onPress={() => removeItemFromShoppingList(item)}>remove</Text>
                  </View>
                </View>
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
