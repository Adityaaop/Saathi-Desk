const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

dbPromise.then(async (db) => {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT DEFAULT 'user'
        );
        CREATE TABLE IF NOT EXISTS Tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'Low',
            assigned_to INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_to) REFERENCES Users(id) ON DELETE SET NULL
        );

        INSERT OR IGNORE INTO Users (id, name, email, role)
        VALUES (1, 'Aditya', 'aditya@saathidesk.local', 'admin');
    `);
    console.log('Connected to SQLite database.');
}).catch((err) => {
    console.error('Database connection error:', err);
});

module.exports = dbPromise;
