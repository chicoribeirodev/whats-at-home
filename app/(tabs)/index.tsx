import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../_layout';

export default function HomeScreen() {
  const { user } = useContext(AppContext);

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
        <ThemedText type="default">Welcome {user?.name}!</ThemedText>
        <ThemedText type="subtitle">Calendar</ThemedText>
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
