import { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppContext } from './_layout';

export default function Recipe() {
  const { openRecipe } = useContext(AppContext)

  return (
    <ThemedView style={[StyleSheet.absoluteFill, { padding: 16, paddingTop: 16 }]}>
      <ThemedText type="title">{openRecipe?.title}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Ingredients:</ThemedText>
      {openRecipe?.ingredients.map((ingredient: string, idx: number) => (
        <ThemedText key={idx}>- {ingredient}</ThemedText>
      ))}
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Difficulty: {openRecipe?.difficulty}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Time to make: {openRecipe?.time_to_make_minutes} minutes</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Best time of day: {openRecipe?.time_of_day}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Instructions:</ThemedText>
      {openRecipe?.instructions.map((instruction: string, idx: number) => (
        <ThemedText key={idx}>{idx + 1}. {instruction}</ThemedText>
      ))}
    </ThemedView>
  );
}
