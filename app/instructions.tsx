import { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppContext } from './_layout';

export default function Instructions() {
  const { openRecipe } = useContext(AppContext)

  return (
    <ThemedView style={StyleSheet.absoluteFill}>
      <ThemedText type="title">Instructions</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Instructions:</ThemedText>
      {openRecipe?.instructions.map((instruction: string, idx: number) => (
        <ThemedText key={idx}>{idx + 1}. {instruction}</ThemedText>
      ))}
    </ThemedView>
  );
}
