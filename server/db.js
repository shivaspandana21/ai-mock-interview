const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

let dbInstance = null;

// Wrap node:sqlite sync methods in promises to keep compatibility with index.js code
class NodeSqliteWrapper {
  constructor(db) {
    this.db = db;
  }
  
  async get(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params);
  }

  async all(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  async run(sql, params = []) {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...params);
    // Convert BigInt to Number if needed (node:sqlite returns the value as a Number currently in many environments but BigInt is common in newer JS features)
    const lastID = typeof result.lastInsertRowid === 'bigint' ? Number(result.lastInsertRowid) : result.lastInsertRowid;
    return { lastID, changes: result.changes };
  }

  async exec(sql) {
    this.db.exec(sql);
  }
}

async function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(__dirname, 'database.sqlite');
  console.log(`Connecting to SQLite at: ${dbPath}`);
  
  const baseDb = new DatabaseSync(dbPath);
  
  // Enable Foreign Key Enforcement
  baseDb.exec('PRAGMA foreign_keys = ON;');
  
  dbInstance = new NodeSqliteWrapper(baseDb);

  // Initialize schemas if they don't exist
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await dbInstance.exec(schemaSql);
    console.log("Database schema synchronized.");
  }

  return dbInstance;
}

module.exports = {
  getDb
};
