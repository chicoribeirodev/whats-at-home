export const EXAMPLE_BARCODES = [
  "5600499545911",
  "3596710547623",
  "7394376616709"
];

export const EXAMPLE_RECIPES = [
  {
    "title": "Simple Chocolate Waffle Milkshake",
    "ingredients": [
      "Chocolate covered Waffles 180 g",
      "Avena Barista Edition 1000 ml"
    ],
    "instructions": [
      "Break the chocolate covered waffles into smaller pieces.",
      "Place the waffle pieces and Avena Barista Edition in a blender.",
      "Blend until smooth and creamy.",
      "Pour into a glass and serve chilled."
    ],
    "difficulty": "very easy",
    "time_to_make_minutes": 5,
    "time_of_day": "any",
    "calories": 450,
    "calories_unit": "kcal",
    "if_you_also_have": []
  },
  {
    "title": "Crumbled Chocolate Waffle and Dark Chocolate Oat Drink",
    "ingredients": [
      "Chocolate covered Waffles 180 g",
      "72% Noir fèves de cacao 100 g",
      "Avena Barista Edition 1000 ml"
    ],
    "instructions": [
      "Chop the 72% Noir fèves de cacao into small pieces.",
      "Crumble the chocolate covered waffles into bite-sized chunks.",
      "Heat half of the Avena Barista Edition in a saucepan without boiling.",
      "Add the chopped cacao beans to the warm oat milk, stirring until slightly melted.",
      "In serving glasses, layer the crumbled waffles and pour the warm oat milk mixture over.",
      "Serve warm or at room temperature."
    ],
    "difficulty": "easy",
    "time_to_make_minutes": 15,
    "time_of_day": "breakfast",
    "calories": 600,
    "calories_unit": "kcal",
    "if_you_also_have": []
  },
  {
    "title": "Bonus Recipe: Warm Chocolate Oat Latte with Crumbled Waffles",
    "ingredients": [
      "72% Noir fèves de cacao 100 g",
      "Avena Barista Edition 1000 ml",
      "Chocolate covered Waffles 180 g",
      "salt"
    ],
    "instructions": [
      "Heat the Avena Barista Edition in a saucepan over medium heat until warm but not boiling.",
      "Add small pieces of the 72% Noir fèves de cacao and a pinch of salt to the warm oat milk, stirring constantly until smooth and melted.",
      "Crumble the chocolate covered waffles and place them in serving cups.",
      "Pour the warm chocolate oat latte over the crumbled waffles.",
      "Serve immediately for a cozy treat."
    ],
    "difficulty": "medium",
    "time_to_make_minutes": 20,
    "time_of_day": "any",
    "calories": 650,
    "calories_unit": "kcal",
    "if_you_also_have": [
      "cinnamon",
      "vanilla extract",
      "whipped cream"
    ]
  }
]

export const EXAMPLE_SUGGESTED_MEALS = [
  {
    "title": "Mediterranean Chicken with Roasted Vegetables and Rice",
    "description": "A simple and healthy Mediterranean-style chicken dish with roasted vegetables served over steamed white rice.",
    "type_of_meal": "lunch",
    "ingredients": [
      { "name": "chicken breast", "quantity": 400, "unit": "grams" },
      { "name": "bell peppers (mixed colors)", "quantity": 2, "unit": "pieces" },
      { "name": "zucchini", "quantity": 1, "unit": "piece" },
      { "name": "cherry tomatoes", "quantity": 150, "unit": "grams" },
      { "name": "rice", "quantity": 150, "unit": "grams" },
      { "name": "olive oil", "quantity": 3, "unit": "tablespoons" },
      { "name": "salt", "quantity": 1, "unit": "teaspoon" },
      { "name": "black pepper", "quantity": 0.5, "unit": "teaspoon" },
      { "name": "dried oregano", "quantity": 1, "unit": "teaspoon" },
      { "name": "lemon juice", "quantity": 1, "unit": "tablespoon" }
    ],
    "steps": [
      "Preheat oven to 200°C (390°F).",
      "Cut the bell peppers and zucchini into bite-sized pieces.",
      "In a bowl, toss the vegetables with 1 tablespoon of olive oil, half the salt, pepper, and oregano.",
      "Place the vegetables on a baking tray and roast for 20 minutes.",
      "Meanwhile, season the chicken breasts with salt, pepper, oregano, and lemon juice.",
      "Heat 1 tablespoon olive oil in a skillet over medium heat and cook chicken for about 6-7 minutes per side until cooked through.",
      "Cook the rice according to package instructions.",
      "After 20 minutes, add cherry tomatoes to the roasting vegetables and roast for 5 more minutes.",
      "Serve the chicken sliced over rice with roasted vegetables on the side."
    ]
  },
  {
    "title": "Quick Tuna and Chickpea Salad with Mixed Greens",
    "description": "A fresh and protein-packed Mediterranean-inspired tuna salad with chickpeas and mixed greens, ideal for a light lunch.",
    "type_of_meal": "lunch",
    "ingredients": [
      { "name": "canned tuna in olive oil", "quantity": 2, "unit": "cans (120g each)" },
      { "name": "canned chickpeas", "quantity": 240, "unit": "grams (drained weight)" },
      { "name": "mixed salad greens", "quantity": 100, "unit": "grams" },
      { "name": "cherry tomatoes", "quantity": 100, "unit": "grams" },
      { "name": "red onion", "quantity": 0.5, "unit": "piece" },
      { "name": "lemon juice", "quantity": 1, "unit": "tablespoon" },
      { "name": "olive oil", "quantity": 2, "unit": "tablespoons" },
      { "name": "black pepper", "quantity": 0.25, "unit": "teaspoon" },
      { "name": "salt", "quantity": 0.5, "unit": "teaspoon" }
    ],
    "steps": [
      "Drain the canned tuna and chickpeas.",
      "Rinse chickpeas under cold water and drain again.",
      "Thinly slice the red onion and halve the cherry tomatoes.",
      "In a large bowl, combine mixed greens, tuna, chickpeas, cherry tomatoes, and red onion.",
      "In a small bowl, whisk lemon juice, olive oil, salt, and pepper.",
      "Pour the dressing over the salad and toss gently to combine.",
      "Serve immediately or chilled."
    ]
  },
  {
    "title": "Baked Cod with Potatoes and Steamed Broccoli",
    "description": "Oven-baked cod seasoned simply and served with boiled potatoes and steamed broccoli for a balanced Mediterranean dinner.",
    "type_of_meal": "dinner",
    "ingredients": [
      { "name": "cod fillets", "quantity": 400, "unit": "grams" },
      { "name": "potatoes", "quantity": 300, "unit": "grams" },
      { "name": "broccoli", "quantity": 200, "unit": "grams" },
      { "name": "olive oil", "quantity": 2, "unit": "tablespoons" },
      { "name": "lemon juice", "quantity": 1, "unit": "tablespoon" },
      { "name": "paprika", "quantity": 1, "unit": "teaspoon" },
      { "name": "salt", "quantity": 1, "unit": "teaspoon" },
      { "name": "black pepper", "quantity": 0.5, "unit": "teaspoon" }
    ],
    "steps": [
      "Preheat oven to 200°C (390°F).",
      "Peel and cut potatoes into cubes; boil in salted water until tender, about 15 minutes.",
      "Meanwhile, place cod fillets on a baking tray lined with parchment paper.",
      "Drizzle cod with 1 tablespoon olive oil, lemon juice, paprika, salt, and pepper.",
      "Bake cod for 15-18 minutes until opaque and flaky.",
      "Cut broccoli into florets and steam until tender, about 5-7 minutes.",
      "Drain potatoes and toss with remaining olive oil and a pinch of salt.",
      "Serve the baked cod with potatoes and steamed broccoli."
    ]
  },
  {
    "title": "Mediterranean Beef Stir-Fry with Peppers and Couscous",
    "description": "Quick beef stir-fry with colorful bell peppers served with fluffy couscous, a tasty Mediterranean dinner.",
    "type_of_meal": "dinner",
    "ingredients": [
      { "name": "beef strips", "quantity": 400, "unit": "grams" },
      { "name": "bell peppers (mixed colors)", "quantity": 2, "unit": "pieces" },
      { "name": "couscous", "quantity": 150, "unit": "grams" },
      { "name": "olive oil", "quantity": 3, "unit": "tablespoons" },
      { "name": "lemon juice", "quantity": 1, "unit": "tablespoon" },
      { "name": "paprika", "quantity": 1, "unit": "teaspoon" },
      { "name": "black pepper", "quantity": 0.5, "unit": "teaspoon" },
      { "name": "salt", "quantity": 1, "unit": "teaspoon" },
      { "name": "fresh parsley", "quantity": 10, "unit": "grams" }
    ],
    "steps": [
      "Prepare couscous according to package instructions and set aside.",
      "Slice bell peppers into strips.",
      "Heat 2 tablespoons olive oil in a large skillet over medium-high heat.",
      "Add beef strips, season with salt, pepper, and paprika, and stir-fry for 4-5 minutes until browned.",
      "Add bell peppers and lemon juice, cook for another 4-5 minutes until peppers are tender-crisp.",
      "Fluff couscous with a fork and mix in 1 tablespoon olive oil and chopped fresh parsley.",
      "Serve the beef and pepper stir-fry over couscous."
    ]
  }
]

export const EXAMPLE_SHOPPING_LIST = [
  { "name": "chicken breast", "quantity": 400, "unit": "grams", "category": "meat" },
  { "name": "bell peppers (mixed colors)", "quantity": 4, "unit": "units", "category": "produce" },
  { "name": "zucchini", "quantity": 1, "unit": "unit", "category": "produce" },
  { "name": "cherry tomatoes", "quantity": 250, "unit": "grams", "category": "produce" },
  { "name": "rice", "quantity": 150, "unit": "grams", "category": "pantry" },
  { "name": "olive oil", "quantity": 10, "unit": "tablespoons", "category": "pantry" },
  { "name": "salt", "quantity": 3.5, "unit": "teaspoons", "category": "pantry" },
  { "name": "black pepper", "quantity": 1.75, "unit": "teaspoons", "category": "pantry" },
  { "name": "dried oregano", "quantity": 1, "unit": "teaspoon", "category": "pantry" },
  { "name": "lemon juice", "quantity": 4, "unit": "tablespoons", "category": "produce" },
  { "name": "canned tuna in olive oil", "quantity": 240, "unit": "grams", "category": "seafood" },
  { "name": "canned chickpeas", "quantity": 240, "unit": "grams", "category": "pantry" },
  { "name": "mixed salad greens", "quantity": 100, "unit": "grams", "category": "produce" },
  { "name": "red onion", "quantity": 0.5, "unit": "unit", "category": "produce" },
  { "name": "cod fillets", "quantity": 400, "unit": "grams", "category": "seafood" },
  { "name": "potatoes", "quantity": 300, "unit": "grams", "category": "produce" },
  { "name": "broccoli", "quantity": 200, "unit": "grams", "category": "produce" },
  { "name": "paprika", "quantity": 2, "unit": "teaspoons", "category": "pantry" },
  { "name": "beef strips", "quantity": 400, "unit": "grams", "category": "meat" },
  { "name": "couscous", "quantity": 150, "unit": "grams", "category": "pantry" },
  { "name": "fresh parsley", "quantity": 10, "unit": "grams", "category": "produce" }
]