import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { generateMealsOutputSchema, generateMealsPrompt, generateShoppingListOutputSchema, generateShoppingListPrompt, regenerateMealRecipePrompt } from '@/constants/prompts';
import { addItemsToShoppingList, addRecipe, addRecipes, getAllRecipes, getShoppingList } from '@/database';
import { aiClient, MODEL } from '@/lib/open-ai-client';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppContext, Recipe, ShoppingListItem } from '../_layout';

export default function Planner() {
  const [inputValues, setInputValues] = useState({
    people: 0,
    lunches: 0,
    dinners: 0,
    dietaryGoals: '',
    allergies: ''
  });
  const [meals, setMeals] = useState<any[]>([] /* EXAMPLE_MEAL_RECIPES */);
  const [loadingMeals, setLoadingMeals] = useState(false);

  const { setSavedRecipes, setShoppingList, setOpenRecipe, user } = useContext(AppContext)

  const getMealRecipes = async () => {
    console.log('Generating meals and recipes:');

    setMeals([]);
    setLoadingMeals(true);

    const response = await aiClient.responses.create({
      model: MODEL,
      input: generateMealsPrompt(inputValues, user?.language || 'en'),
      text: generateMealsOutputSchema as any,
    });

    const data = response.output_text ? JSON.parse(response.output_text) : {};

    setMeals(data?.meals || []);
    setLoadingMeals(false);
  };

  const regenerateMealRecipe = async (mealIndex: number) => {
    console.log(`Regenerating meal at index ${mealIndex}...`);

    const mealToRegenerate = meals[mealIndex];
    if (!mealToRegenerate) {
      console.error('Meal to regenerate not found at index:', mealIndex);
      return;
    }

    const otherMeals = meals.filter((_, idx) => idx !== mealIndex).map((meal) => ({ title: meal.title, ingredients: meal.ingredients }));

    const response = await aiClient.responses.create({
      model: MODEL,
      input: regenerateMealRecipePrompt(mealToRegenerate, otherMeals, user?.language || 'en'),
      text: generateMealsOutputSchema as any,
    });

    const data = response.output_text ? JSON.parse(response.output_text) : {};
    const newMeal = data?.meals ? data.meals[0] : null;

    if (newMeal) {
      setMeals((prevMeals) => {
        const updatedMeals = [...prevMeals];
        updatedMeals[mealIndex] = newMeal;
        return updatedMeals;
      });
    } else {
      console.error('Failed to regenerate meal. No meal data returned from AI response.');
    }
  };

  const addToCalendar = () => { console.log('Adding meals to calendar...') };

  const saveRecipe = async (recipe: Recipe) => {
    console.log('Saving recipe to list...', recipe.title)

    await addRecipe({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      difficulty: recipe.difficulty,
      time_to_make_minutes: recipe.time_to_make_minutes,
      calories: recipe.calories,
      calories_unit: recipe.calories_unit,
      time_of_day: recipe.time_of_day,
      type_of_meal: recipe.type_of_meal,
      if_you_also_have: recipe.if_you_also_have,
    });

    const items = await getAllRecipes();

    setSavedRecipes(items as Recipe[]);

    alert('Recipe saved! You can find it in the Recipes tab.');
  };

  const saveRecipes = async () => {
    console.log('Saving meals to list...')

    await addRecipes(meals.map((meal) => ({
      title: meal.title,
      description: meal.description,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      difficulty: meal.difficulty,
      time_to_make_minutes: meal.time_to_make_minutes,
      calories: meal.calories,
      calories_unit: meal.calories_unit,
      time_of_day: meal.time_of_day,
      type_of_meal: meal.type_of_meal,
      if_you_also_have: meal.if_you_also_have,
    })));

    const items = await getAllRecipes();

    setSavedRecipes(items as Recipe[]);

    alert('Recipes saved! You can find them in the Recipes tab.');
  };

  const addToShoppingList = async () => {
    console.log('Adding meals to shopping list...')

    const response = await aiClient.responses.create({
      model: MODEL,
      input: generateShoppingListPrompt(meals, user?.language || 'en'),
      text: generateShoppingListOutputSchema as any,
    });

    const data = response.output_text ? JSON.parse(response.output_text) : {};

    await addItemsToShoppingList(data?.shopping_list || []);

    const items = await getShoppingList();
    setShoppingList(items as ShoppingListItem[]);

    alert('Meal ingredients added to shopping list!');
  };

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
        <Pressable style={{ ...styles.button, marginTop: 10 }} onPress={getMealRecipes}>
          <ThemedText style={styles.buttonText}>🍽 Generate Meals</ThemedText>
        </Pressable>
        {loadingMeals ? (
          <ThemedText type="defaultSemiBold">Generating your meal plan...</ThemedText>
        ) : (
          meals.length > 0 && meals.map((meal: any, index: number) => (
            <ThemedView key={`meal-${index}`} style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
              <View style={{ flexDirection: 'row', marginBottom: 8, justifyContent: 'space-between' }}>
                <View style={{}}>
                  <Text>{meal.type_of_meal}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View>
                    <Text style={{ textDecorationLine: 'underline' }} onPress={() => regenerateMealRecipe(index)}>regenerate</Text>
                  </View>
                  <View>
                    <Text style={{ textDecorationLine: 'underline' }} onPress={() => saveRecipe(meal)}>save</Text>
                  </View>
                </View>
              </View>
              <ThemedText type="subtitle">{meal.title}</ThemedText>
              <ThemedText type="default">{meal.description}</ThemedText>
              <ThemedText type="defaultSemiBold">Ingredients:</ThemedText>
              {meal.ingredients.map((ingredient: any, idx: number) => (
                <ThemedText key={`ingredient-${idx}`} type="default">- {ingredient.quantity} {ingredient.unit} {ingredient.name}</ThemedText>
              ))}
              <Pressable style={styles.recipeButton} onPress={() => {
                setOpenRecipe(meal);
                router.push('/recipe');
              }}>
                <ThemedText style={styles.recipeButtonText}>View Instructions</ThemedText>
              </Pressable>
            </ThemedView>
          ))
        )}
        {meals.length > 0 && (
          <>
            <Pressable style={styles.button} onPress={addToCalendar}>
              <ThemedText style={styles.buttonText}>🗓 Add to Calendar</ThemedText>
            </Pressable>
            <Pressable style={styles.button} onPress={saveRecipes}>
              <ThemedText style={styles.buttonText}>💾 Save Recipes</ThemedText>
            </Pressable>
            <Pressable style={styles.button} onPress={addToShoppingList}>
              <ThemedText style={styles.buttonText}>🛒 Add to Shopping List</ThemedText>
            </Pressable>
          </>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputElement: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
  recipeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  recipeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
