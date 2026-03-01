import { useContext } from 'react';
import { ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppContext } from './_layout';

export default function Recipe() {
  const { openRecipe } = useContext(AppContext)

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
      <ThemedText type="title">{openRecipe?.title}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Ingredients:</ThemedText>
      {openRecipe?.ingredients.map((ingredient: string, idx: number) => (
        <ThemedText key={`ingredients-${idx}`}>- {ingredient}</ThemedText>
      ))}
      {openRecipe?.if_you_also_have && (<>
        <ThemedText type="subtitle" style={{ marginTop: 8 }}>If you also have:</ThemedText>
        {openRecipe.if_you_also_have.map((ingredient: string, idx: number) => (
          <ThemedText key={`if-you-also-have-${idx}`}>- {ingredient}</ThemedText>
        ))}
      </>
      )}
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Difficulty: {openRecipe?.difficulty}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Time to make: {openRecipe?.time_to_make_minutes} minutes</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Best time of day: {openRecipe?.time_of_day}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Calories: {openRecipe?.calories}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Instructions:</ThemedText>
      {openRecipe?.instructions.map((instruction: string, idx: number) => (
        <ThemedText key={`instructions-${idx}`}>{idx + 1}. {instruction}</ThemedText>
      ))}
    </ScrollView>
  );
}
