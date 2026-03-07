export const originalGenerateRecipesPrompt = (products: any[]) => `Generate a list of 3 practical recipes using the following ingredients: ${products.map(p => `${p.name} ${p.quantity} ${p.unit}`).join(", ")}.
        These recipes should only include the provided ingredients and should be able to make at home.
        You can assume basic pantry staples like salt, pepper, oil, olive oil, onion and garlic are available for cooking, but they don't need to be included in the recipes mandatorily, only if they make sense to be included.
        These recipes should be useful and make sense given the provided ingredients. 
        They don't need to include all the ingredients, but try to use as many as possible.
        Consider at least one simple recipe.
        Try to keep the recipes as simple and easy to make as possible, but it's ok to provide one harder recipe if it makes good use of the ingredients.
        The third recipe should include the if_you_also_have field with a list of 3 additional ingredients that would make the recipe better but are not strictly necessary, and that the user is likely to have at home - add 'bonus recipe' in the title to identify this one.
        `

export const generateRecipesPrompt = (products: any[]) => `Role: You are a practical home-cooking assistant.

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
- Output ONLY valid JSON`

export const generateMealsPrompt = (inputValues: any) => `Create a meal plan for the next ${inputValues.lunches} lunches and ${inputValues.dinners} dinners.

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

For each meal include:
- title
- description
- type_of_meal (lunch or dinner)
- list of ingredients with quantity and unit
- step-by-step cooking instructions

Additional guidelines:
- Prioritize balanced meals with protein, vegetables, and complex carbohydrates when possible.
- Minimize food waste by reusing ingredients across multiple meals when appropriate.
- Avoid overly exotic or hard-to-find ingredients.
- Meals should be suitable for normal weekday cooking (not elaborate or restaurant-style).

Output rules:
- Output must strictly match the provided JSON schema
- No commentary, no explanations, no extra text
- Output ONLY valid JSON
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
              ingredients: {
                type: "array",
                items: { type: "string" }
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
            required: ["title", "ingredients", "instructions", "difficulty", "time_to_make_minutes", "time_of_day", "calories", "calories_unit", "if_you_also_have"]
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
              steps: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["title", "description", "type_of_meal", "ingredients", "steps"]
          },
        }
      },
      required: ["meals"]
    }
  }
}