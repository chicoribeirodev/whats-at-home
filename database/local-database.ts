import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app.db');

export const initDatabase = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      time_to_make_minutes INTEGER NOT NULL,
      calories REAL NOT NULL,
      calories_unit TEXT NOT NULL,
      time_of_day TEXT,
      type_of_meal TEXT,
      if_you_also_have TEXT
    );

    CREATE TABLE IF NOT EXISTS shopping_list (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      category TEXT NOT NULL,
      unit_price_eur REAL NOT NULL,
      total_price_eur REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS logged_in_user (
      id INTEGER PRIMARY KEY NOT NULL
    );
  `);
};

export const clearDatabase = async () => {
  await db.execAsync(`
    DROP TABLE IF EXISTS recipes;
    DROP TABLE IF EXISTS shopping_list;
    DROP TABLE IF EXISTS logged_in_user;
  `);
};

export const resetDatabase = async () => {
  await clearDatabase();
  await initDatabase();
};

export const seedDatabase = async () => {
  await db.execAsync(`
    INSERT INTO recipes (title, description, ingredients, instructions, difficulty, time_to_make_minutes, calories, calories_unit) VALUES (
      'Spaghetti Bolognese',
      'A classic Italian pasta dish with rich meat sauce.',
      '[{"name": "spaghetti", "quantity": 200, "unit": "g"}, {"name": "ground beef", "quantity": 300, "unit": "g"}, {"name": "tomato sauce", "quantity": 400, "unit": "ml"}]',
      '["Cook spaghetti according to package instructions.", "In a pan, brown the ground beef.", "Add tomato sauce to the beef and simmer for 15 minutes.", "Serve sauce over spaghetti."]',
      'Medium',
      30,
      600,
      'kcal'
    );

    INSERT INTO shopping_list (name, quantity, unit, category, unit_price_eur, total_price_eur) VALUES (
      'spaghetti',
      200,
      'g',
      'Pasta',
      0.01,
      2
    );

    INSERT INTO shopping_list (name, quantity, unit, category, unit_price_eur, total_price_eur) VALUES (
      'ground beef',
      300,
      'g',
      'Meat',
      0.02,
      6
    );

    INSERT INTO shopping_list (name, quantity, unit, category, unit_price_eur, total_price_eur) VALUES (
      'tomato sauce',
      400,
      'ml',
      'Canned Goods',
      0.015,
      6
    );
  `);
};

export const getLoggedInUserId = async (): Promise<number | null> => {
  const result = (await db.getAllAsync('SELECT id FROM logged_in_user LIMIT 1')) as Array<{
    id: number;
  }>;

  console.dir(result, { depth: null });
  return result.length > 0 ? result[0].id : null;
};

export const setLoggedInUserId = async (userId: number | null) => {
  console.log(`Setting logged in user id to ${userId} in local database.`);
  await db.runAsync('INSERT OR REPLACE INTO logged_in_user (id) VALUES (?)', [userId]);
};

export const getAllRecipes = async () => {
  const recipes = await db.getAllAsync('SELECT * FROM recipes');
  return recipes.map((recipe: any) => ({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
    instructions: JSON.parse(recipe.instructions),
    if_you_also_have: recipe.if_you_also_have ? JSON.parse(recipe.if_you_also_have) : undefined,
  }));
};

export const getShoppingList = async () => {
  return await db.getAllAsync('SELECT * FROM shopping_list');
};

export const addRecipe = async (recipe: any) => {
  await db.runAsync(
    'INSERT INTO recipes (title, description, ingredients, instructions, difficulty, time_to_make_minutes, calories, calories_unit, time_of_day, type_of_meal, if_you_also_have) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      recipe.title,
      recipe.description,
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.instructions),
      recipe.difficulty,
      recipe.time_to_make_minutes,
      recipe.calories,
      recipe.calories_unit,
      recipe.time_of_day || null,
      recipe.type_of_meal || null,
      recipe.if_you_also_have ? JSON.stringify(recipe.if_you_also_have) : null,
    ]
  );
};

export const addRecipes = async (recipes: any[]) => {
  const placeholders = recipes.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
  const values = recipes.flatMap(recipe => [
    recipe.title,
    recipe.description,
    JSON.stringify(recipe.ingredients),
    JSON.stringify(recipe.instructions),
    recipe.difficulty,
    recipe.time_to_make_minutes,
    recipe.calories,
    recipe.calories_unit,
    recipe.time_of_day || null,
    recipe.type_of_meal || null,
    recipe.if_you_also_have ? JSON.stringify(recipe.if_you_also_have) : null,
  ]);
  await db.runAsync(
    `INSERT INTO recipes (title, description, ingredients, instructions, difficulty, time_to_make_minutes, calories, calories_unit, time_of_day, type_of_meal, if_you_also_have) VALUES ${placeholders}`,
    values
  );
  console.log(`Added ${recipes.length} recipes to database.`);
};

export const deleteRecipe = async (id: number) => {
  await db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
  console.log(`Recipe with id ${id} removed from database.`);
};

export const addShoppingListItem = async (item: any) => {
  await db.runAsync(
    'INSERT INTO shopping_list (name, quantity, unit, category, unit_price_eur, total_price_eur) VALUES (?, ?, ?, ?, ?, ?)',
    [item.name, item.quantity, item.unit, item.category, item.unit_price_eur, item.total_price_eur]
  );
};

export const addItemsToShoppingList = async (items: any[]) => {
  const placeholders = items.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
  const values = items.flatMap(item => [item.name, item.quantity, item.unit, item.category, item.unit_price_eur, item.total_price_eur]);
  await db.runAsync(
    `INSERT INTO shopping_list (name, quantity, unit, category, unit_price_eur, total_price_eur) VALUES ${placeholders}`,
    values
  );
  console.log(`Added ${items.length} items to shopping list in database.`);
};

export const updateShoppingListItem = async (id: number, item: any) => {
  await db.runAsync(
    'UPDATE shopping_list SET name = ?, quantity = ?, unit = ?, category = ?, unit_price_eur = ?, total_price_eur = ? WHERE id = ?',
    [item.name, item.quantity, item.unit, item.category, item.unit_price_eur, item.total_price_eur, id]
  );
  console.log(`Updated item with id ${id} in shopping list in database.`);
};

export const removeShoppingListItem = async (id: number) => {
  await db.runAsync('DELETE FROM shopping_list WHERE id = ?', [id]);
  console.log(`Removed item with id ${id} from shopping list in database.`);
};

export const clearShoppingList = async () => {
  await db.runAsync('DELETE FROM shopping_list');
  console.log('Shopping list cleared from database.');
};