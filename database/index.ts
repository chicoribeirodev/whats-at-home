import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app.db');
export type TestRow = { id: number; value: string; intValue: number };

export const testDatabase = async () => {
  // Create table
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      intValue INTEGER
    );
    INSERT INTO test (value, intValue) VALUES ('test1', 123);
    INSERT INTO test (value, intValue) VALUES ('test2', 456);
  `);

  // Insert one row
  const result = await db.runAsync(
    'INSERT INTO test (value, intValue) VALUES (?, ?)',
    ['aaa', 100]
  );
  console.log('Inserted row id:', result.lastInsertRowId);

  // Update a row
  await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']);

  // Delete a row
  await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' });

  // Read first row
  const firstRow = await db.getFirstAsync<TestRow>('SELECT * FROM test');
  console.log('First row:', firstRow);

  // Read all rows
  const allRows = await db.getAllAsync<TestRow>('SELECT * FROM test');
  console.log('All rows:', allRows);

  // Iterate with getEachAsync
  for await (const row of db.getEachAsync<TestRow>('SELECT * FROM test')) {
    console.log('Row:', row);
  }
};