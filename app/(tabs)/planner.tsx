import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { generateMealsOutputSchema, generateMealsPrompt, generateShoppingListOutputSchema, generateShoppingListPrompt } from '@/constants/prompts';
import { aiClient, MODEL } from '@/lib/open-ai-client';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { AppContext } from '../_layout';

export default function Planner() {
  const [inputValues, setInputValues] = useState({
    people: 0,
    lunches: 0,
    dinners: 0,
    dietaryGoals: '',
    allergies: ''
  });
  const [meals, setMeals] = useState<any[]>([] /* EXAMPLE_SUGGESTED_MEALS */);
  const [loadingMeals, setLoadingMeals] = useState(false);

  const { setShoppingList } = useContext(AppContext)

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

  const addToCalendar = () => { console.log('Adding meals to calendar...') };

  const addToShoppingList = async () => {
    console.log('Adding meals to shopping list...')

    const response = await aiClient.responses.create({
      model: MODEL,
      input: generateShoppingListPrompt(meals),
      text: generateShoppingListOutputSchema as any,
    });

    const data = response.output_text ? JSON.parse(response.output_text) : {};

    setShoppingList(data?.shopping_list || []);
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
        <ThemedText type="title">Meal Planner</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="defaultSemiBold">Plan your next meals.</ThemedText>
        <ThemedText type="default">Number of people:</ThemedText>
        <TextInput placeholder="e.g. 2" keyboardType="numeric" style={styles.inputElement} onChange={e => setInputValues({
          ...inputValues,
          people: parseInt(e.nativeEvent.text) || 0
        })} />
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
        <ThemedText type="default">Dietary goals for these meals:</ThemedText>
        <TextInput placeholder="e.g. low carb, high protein, vegetarian, etc." style={styles.inputElement} onChange={e => setInputValues({
          ...inputValues,
          dietaryGoals: e.nativeEvent.text
        })} />
        <ThemedText type="default">Allergies or restrictions:</ThemedText>
        <TextInput placeholder="e.g. nuts, dairy, gluten, etc." style={styles.inputElement} onChange={e => setInputValues({
          ...inputValues,
          allergies: e.nativeEvent.text
        })} />
        <Pressable style={{ ...styles.cameraButton, marginTop: 10 }} onPress={getMeals}>
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
        {meals.length > 0 && (
          <>
            <Pressable style={styles.cameraButton} onPress={addToCalendar}>
              <ThemedText style={styles.cameraButtonText}>🗓 Add to Calendar</ThemedText>
            </Pressable>
            <Pressable style={styles.cameraButton} onPress={addToShoppingList}>
              <ThemedText style={styles.cameraButtonText}>🛒 Add to Shopping List</ThemedText>
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
