import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { deleteRecipe as deleteRecipeDB, getAllRecipes as getAllRecipesDB } from '@/database';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppContext, Recipe } from '../_layout';

export default function Recipes() {
  const { savedRecipes, setSavedRecipes, setOpenRecipe } = useContext(AppContext);

  const openRecipeDetails = (recipe: any) => {
    setOpenRecipe(recipe);
    router.push(`/recipe`);
  };

  const deleteRecipe = async (recipeId: number) => {
    console.log(`Deleting recipe with id ${recipeId}...`);
    await deleteRecipeDB(recipeId);
    setOpenRecipe(null);

    const recipes = await getAllRecipesDB();
    setSavedRecipes(recipes as Recipe[]);
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
        <ThemedText type="title">Recipes</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Pressable style={{ ...styles.button, marginBottom: 12 }} onPress={() => router.push('/generate-recipes')}>
          <ThemedText style={styles.buttonText}>🤖 Generate New Recipes</ThemedText>
        </Pressable>
        {savedRecipes.length > 0 ? (
          <>
            <ThemedText type="defaultSemiBold">List of Saved Recipes ({savedRecipes.length})</ThemedText>

            {savedRecipes.map(recipe => (
              <ThemedView key={recipe.id} style={styles.recipeWrapper}>
                <View style={{ flexDirection: 'row', marginBottom: 8, justifyContent: 'flex-end' }}>
                  <View>
                    <Text style={{ textDecorationLine: 'underline' }} onPress={() => deleteRecipe(recipe.id)}>
                      delete
                    </Text>
                  </View>
                </View>
                <ThemedText type="subtitle">{recipe.title}</ThemedText>
                <ThemedText type="default">{recipe.description}</ThemedText>
                <Pressable
                  onPress={() => openRecipeDetails(recipe)}
                  style={styles.button}
                >
                  <ThemedText style={styles.buttonText}>Open Recipe</ThemedText>
                </Pressable>
              </ThemedView>
            ))}
          </>
        ) : (
          <ThemedText type="defaultSemiBold">No saved recipes yet. Generate some based on your products!</ThemedText>
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
  recipeWrapper: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
