export const generateRecipesPrompt = (products: any[], language: string) => `Role: You are a practical home-cooking assistant.

Input ingredients:
${products.map(p => `${p.name} ${p.quantity} ${p.unit}`).join(", ")}

Objective:
Generate exactly 3 realistic home recipes.

Constraints:
- Use ONLY the provided ingredients.
- You may optionally use these pantry staples if they make sense:
  salt, pepper, cooking oil, olive oil, onion, garlic
- Do NOT introduce any other ingredients.
- Recipes must be practical and realistic to cook at home.
- Recipes must make culinary sense.
- You do NOT need to use all ingredients, but maximize reasonable usage.
- Keep recipes simple and beginner-friendly.
- At least 1 recipe must be very simple.
- At most 1 recipe may be slightly more advanced.
- Recipe 1 and Recipe 2 should have an empty if_you_also_have field.

Recipe 3 rules:
- Title must include: "Bonus Recipe"
- Must include field: if_you_also_have
- if_you_also_have = exactly 3 common household ingredients
- These must improve the recipe but not be required
- Recipe must work without them

Output rules:
- Output must strictly match the provided JSON schema
- No commentary, no explanations, no extra text
- Output ONLY valid JSON
- Output must be in ${language}
`

export const generateMealsPrompt = (inputValues: any, language: string) => `Create a meal plan for the next ${inputValues.lunches} lunches and ${inputValues.dinners} dinners for ${inputValues.people} people, based on the following information.

Dietary goals:
${inputValues.dietaryGoals}

Allergies or restrictions:
${inputValues.allergies}

Requirements:
- Meals should be practical and easy to cook at home.
- Cooking time should ideally be under 40 minutes.
- Prefer simple techniques suitable for beginner to intermediate cooks.
- Avoid repeating the same main protein or dish style too frequently.
- Use ingredients that are easy to find in Portugal (e.g., typical supermarkets like Continente, Pingo Doce, Lidl).
- Favor Mediterranean-style meals and ingredients common in Portuguese kitchens when possible.
- Assume the user already has basic pantry staples: salt, pepper, olive oil, cooking oil, onion, and garlic.
- Meals should be balanced and include a good mix of protein, vegetables, and carbohydrates when possible.
- Minimize food waste by reusing ingredients across meals when appropriate.
- Avoid overly exotic or hard-to-find ingredients.
- Meals should be suitable for normal weekday cooking (not elaborate or restaurant-style).
- Meals should be varied and not repetitive in terms of main ingredients or cooking methods.
- The meals and quantities should be appropriate for ${inputValues.people} people.

For each meal include:
- title
- description
- type_of_meal (lunch or dinner)
- list of ingredients with quantity and unit
- step-by-step cooking instructions
- difficulty level (easy, medium, hard)
- estimated time to make in minutes
- estimated calories and calories unit

Additional guidelines:
- Prioritize balanced meals with protein, vegetables, and complex carbohydrates when possible.
- Minimize food waste by reusing ingredients across multiple meals when appropriate.
- Avoid overly exotic or hard-to-find ingredients.
- Meals should be suitable for normal weekday cooking (not elaborate or restaurant-style).

Output rules:
- Output must strictly match the provided JSON schema
- No commentary, no explanations, no extra text
- Output ONLY valid JSON
- Output must be in ${language}
`

export const regenerateMealRecipePrompt = (meal: any, otherMeals: any[], language: string) => `Regenerate the recipe for the following meal, keeping the same type of meal (lunch or dinner) and the same dietary goals and restrictions, but providing a completely different recipe that does not repeat the main protein or dish style. The new recipe should still be practical and easy to cook at home, with a cooking time ideally under 40 minutes, and using ingredients that are easy to find in Portugal.

Meal to regenerate:
${JSON.stringify(meal)}

Dietary goals:
${meal.dietary_goals}

Allergies or restrictions:
${meal.allergies}

Other meals in the plan (for reference, to avoid repetition):
${JSON.stringify(otherMeals)}

Requirements:
- Meal should be practical and easy to cook at home.
- Cooking time should ideally be under 40 minutes.
- Prefer simple techniques suitable for beginner to intermediate cooks.
- Avoid repeating the same main protein or dish style as the original meal.
- Use ingredients that are easy to find in Portugal (e.g., typical supermarkets like Continente, Pingo Doce, Lidl).
- Favor Mediterranean-style meals and ingredients common in Portuguese kitchens when possible.
- Assume the user already has basic pantry staples: salt, pepper, olive oil, cooking oil, onion, and garlic.
- Meal should be balanced and include a good mix of protein, vegetables, and carbohydrates when possible.
- Minimize food waste by reusing ingredients across meals when appropriate.
- Avoid overly exotic or hard-to-find ingredients.
- Meal should be suitable for normal weekday cooking (not elaborate or restaurant-style).
- Meal should be varied and not repetitive in terms of main ingredients or cooking methods compared to the original meal.

Output rules:
- Output must strictly match the provided JSON schema
- No commentary, no explanations, no extra text
- Output ONLY valid JSON
- Output must be in ${language}
`

export const generateShoppingListPrompt = (meals: any[], language: string) => `You are given a list of meals with their ingredients.

Task:
Create a consolidated shopping list by combining all ingredients across all meals.

Requirements:

1. Ingredient Consolidation
- Merge identical ingredients appearing in multiple meals.
- Sum their quantities to produce a single total amount per ingredient.
- Ingredient names should be normalized (e.g., "Tomatoes" and "tomato" → "tomato").

2. Unit Normalization
If the same ingredient appears with different units, convert them to a common unit before summing.

Use the following standard units:
- Weight → grams (g)
- Volume → milliliters (ml)
- Count → units

3. Conversion Rules
Use standard cooking conversions when needed, including but not limited to:
- 1 kg = 1000 g
- 1 g = 0.001 kg
- 1 L = 1000 ml
- 1 tbsp = 15 ml
- 1 tsp = 5 ml
- 1 cup = 240 ml
- 1 cup flour = 120 g
- 1 cup sugar = 200 g

4. Categories
Group ingredients into the following categories when applicable:
- produce
- dairy
- meat
- seafood
- bakery
- pantry
- frozen
- other

5. Price Estimation
- Provide an estimated price for each ingredient based on average Portuguese supermarket prices.
- Include a unit price and a total price for the required quantity of that ingredient.

6. Restrictions
- Only include ingredients that appear in the provided meals.
- Do NOT invent ingredients.
- Quantities must be numeric.
- Units must match the normalized unit system.
- Prices should be in Euros (€)

Meals:
${JSON.stringify(meals)}

Output Rules:
- The output MUST strictly match the provided JSON schema.
- Do not include explanations, comments, or extra text.
- Output ONLY valid JSON.
- Output must be in ${language}
`

export const generateRecipesOutputSchema = {
  format: {
    name: "recipes",
    type: "json_schema",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recipes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    quantity: { type: "number" },
                    unit: { type: "string" }
                  },
                  required: ["name", "quantity", "unit"]
                }
              },
              instructions: {
                type: "array",
                items: { type: "string" }
              },
              difficulty: { type: "string" },
              time_to_make_minutes: { type: "number" },
              time_of_day: { type: "string" },
              calories: { type: "number" },
              calories_unit: { type: "string" },
              if_you_also_have: {
                type: "array",
                items: { type: "string" },
              }
            },
            required: ["title", "description", "ingredients", "instructions", "difficulty", "time_to_make_minutes", "time_of_day", "calories", "calories_unit", "if_you_also_have"]
          },
        }
      },
      required: ["recipes"]
    }
  }
}

export const generateMealsOutputSchema = {
  format: {
    name: "meals",
    type: "json_schema",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meals: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              type_of_meal: { type: "string", enum: ["lunch", "dinner"] },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    quantity: { type: "number" },
                    unit: { type: "string" }
                  },
                  required: ["name", "quantity", "unit"]
                }
              },
              instructions: {
                type: "array",
                items: { type: "string" }
              },
              difficulty: { type: "string" },
              time_to_make_minutes: { type: "number" },
              calories: { type: "number" },
              calories_unit: { type: "string" },
            },
            required: ["title", "description", "type_of_meal", "ingredients", "instructions", "difficulty", "time_to_make_minutes", "calories", "calories_unit"]
          },
        }
      },
      required: ["meals"]
    }
  }
}

export const generateShoppingListOutputSchema = {
  format: {
    name: "shopping_list",
    type: "json_schema",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shopping_list: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              quantity: { type: "number" },
              unit: { type: "string" },
              category: { type: "string" },
              unit_price_eur: { type: "number" },
              total_price_eur: { type: "number" },
            },
            required: ["name", "quantity", "unit", "category", "unit_price_eur", "total_price_eur"]
          },
        }
      },
      required: ["shopping_list"]
    }
  }
}