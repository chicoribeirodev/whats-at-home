import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: 20,
        paddingHorizontal: 16,
        minHeight: '100%',
        gap: 16,
        backgroundColor: "white",
      }}
    >
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="default">Welcome to What&apos;s at Home! We&apos;re here to make your life easier by helping you discover delicious recipes based on the ingredients you already have at home.</ThemedText>
        <ThemedText type="subtitle">Your meal planner</ThemedText>
        <ThemedText type="default">TO DO</ThemedText>
        <ThemedText type="subtitle">Your recipes</ThemedText>
        <ThemedText type="default">TO DO</ThemedText>
        <ThemedText type="subtitle">Your shopping list</ThemedText>
        <ThemedText type="default">TO DO</ThemedText>
        <ThemedText type="subtitle">Your stats</ThemedText>
        <ThemedText type="default">TO DO</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
