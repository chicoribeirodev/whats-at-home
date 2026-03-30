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
        paddingTop: 20,
        paddingBottom: 60,
        paddingHorizontal: 16,
        minHeight: '100%',
        gap: 5,
        backgroundColor: "white",
      }}
    >
      <ThemedText type="title">{openRecipe?.title}</ThemedText>
      <ThemedText type="default">{openRecipe?.description}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Ingredients:</ThemedText>
      {openRecipe?.ingredients.map((ingredient, idx: number) => (
        <ThemedText key={idx}>- {ingredient.quantity} {ingredient.unit} {ingredient.name}</ThemedText>
      ))}
      {openRecipe?.if_you_also_have && openRecipe.if_you_also_have.length > 0 && (<>
        <ThemedText type="subtitle" style={{ marginTop: 8 }}>If you also have:</ThemedText>
        {openRecipe.if_you_also_have.map((ingredient: string, idx: number) => (
          <ThemedText key={`if-you-also-have-${idx}`}>- {ingredient}</ThemedText>
        ))}
      </>
      )}
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Difficulty: {openRecipe?.difficulty}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Time to make: {openRecipe?.time_to_make_minutes} minutes</ThemedText>
      {openRecipe?.time_of_day && (
        <ThemedText type="subtitle" style={{ marginTop: 8 }}>Best time of day: {openRecipe.time_of_day}</ThemedText>
      )}
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Calories: {openRecipe?.calories} {openRecipe?.calories_unit}</ThemedText>
      <ThemedText type="subtitle" style={{ marginTop: 8 }}>Instructions:</ThemedText>
      {openRecipe?.instructions.map((instruction: string, idx: number) => (
        <ThemedText key={`instructions-${idx}`}>{idx + 1}. {instruction}</ThemedText>
      ))}
    </ScrollView>
  );
}
