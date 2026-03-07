import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { generateMealsOutputSchema, generateMealsPrompt } from '@/constants/prompts';
import { aiClient, MODEL } from '@/lib/open-ai-client';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

export default function Planner() {
  const [inputValues, setInputValues] = useState({
    lunches: 0,
    dinners: 0,
    dietaryGoals: '',
    allergies: ''
  });
  const [meals, setMeals] = useState<any[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(false);

  const getMeals = async () => {
    console.log('Generating meals:');
    setLoadingMeals(true);

    const response = await aiClient.responses.create({
      model: MODEL,
      input: generateMealsPrompt(inputValues),
      text: generateMealsOutputSchema as any,
    });

    const data = response.output_text ? JSON.parse(response.output_text) : {};

    setMeals(data?.meals || []);
    setLoadingMeals(false);
  };

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
        <ThemedText type="title">Planner</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="defaultSemiBold">Plan your meals for the next days.</ThemedText>
        <ThemedText type="default">How many meals would you like to plan?</ThemedText>
        <ThemedText type="default">Number of lunches:</ThemedText>
        <TextInput placeholder="e.g. 3" keyboardType="numeric" style={styles.inputElement} onChange={e => setInputValues({
          ...inputValues,
          lunches: parseInt(e.nativeEvent.text) || 0
        })} />
        <ThemedText type="default">Number of dinners:</ThemedText>
        <TextInput placeholder="e.g. 3" keyboardType="numeric" style={styles.inputElement} onChange={e => setInputValues({
          ...inputValues,
          dinners: parseInt(e.nativeEvent.text) || 0
        })} />
        <ThemedText type="default">Tell us your dietary goals for these meals:</ThemedText>
        <TextInput placeholder="e.g. low carb, high protein, vegetarian, etc." style={styles.inputElement} onChange={e => setInputValues({
          ...inputValues,
          dietaryGoals: e.nativeEvent.text
        })} />
        <ThemedText type="default">Any allergies or restrictions?</ThemedText>
        <TextInput placeholder="e.g. nuts, dairy, gluten, etc." style={styles.inputElement} onChange={e => setInputValues({
          ...inputValues,
          allergies: e.nativeEvent.text
        })} />
        <Pressable style={styles.cameraButton} onPress={getMeals}>
          <ThemedText style={styles.cameraButtonText}>🍽 Generate Meals</ThemedText>
        </Pressable>
        {loadingMeals ? (
          <ThemedText type="defaultSemiBold">Generating your meal plan...</ThemedText>
        ) : (
          meals.length > 0 && meals.map((meal: any, index: number) => (
            <ThemedView key={`meal-${index}`} style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
              <ThemedText type="subtitle">{meal.title} ({meal.type_of_meal})</ThemedText>
              <ThemedText type="default">{meal.description}</ThemedText>
              <ThemedText type="defaultSemiBold">Ingredients:</ThemedText>
              {meal.ingredients.map((ingredient: any, idx: number) => (
                <ThemedText key={`ingredient-${idx}`} type="default">- {ingredient.quantity} {ingredient.unit} {ingredient.name}</ThemedText>
              ))}
              <ThemedText type="defaultSemiBold">Instructions:</ThemedText>
              {meal.steps.map((step: string, idx: number) => (
                <ThemedText key={`step-${idx}`} type="default">{idx + 1}. {step}</ThemedText>
              ))}
            </ThemedView>
          ))
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
