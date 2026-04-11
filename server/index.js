const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
let db;

// Routes
// Basic test route
app.get('/api/test', async (req, res) => {
  try {
    const result = await db.get("SELECT datetime('now') as now");
    res.json({
      message: 'Hello from Node.js backend!',
      db_status: 'Connected (SQLite)',
      time: result.now
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({
      message: 'Hello from Node.js backend!',
      db_status: 'Disconnected (Error or Database missing)',
      error: err.message
    });
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(`Registration attempt for: ${email}`);
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }

  try {
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      console.log(`Registration failed: ${email} already exists.`);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const result = await db.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password]
    );

    console.log(`User created successfully with ID: ${result.lastID}`);
    res.json({ 
      user: { id: result.lastID, name, email },
      token: 'mock-jwt-token' 
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user || user.password_hash !== password) {
      console.log(`Login failed for: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`User logged in: ${user.name} (ID: ${user.id})`);
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email },
      token: 'mock-jwt-token' 
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// --- Data Endpoints ---

// Get Questions
app.get('/api/questions', async (req, res) => {
  const { stream, difficulty } = req.query;
  try {
    let query = 'SELECT * FROM questions WHERE 1=1';
    let params = [];
    
    if (stream) {
      query += ' AND stream = ?';
      params.push(stream);
    }
    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }
    
    const questions = await db.all(query, params);
    res.json(questions);
  } catch (err) {
    console.error('Fetch questions error:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Auto Generate Questions
app.post('/api/questions/generate', async (req, res) => {
  const { topic } = req.body;
  console.log(`Generating question for topic: ${topic}`);
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const newQuestion = {
      text: `Based on ${topic}, how do you ensure scalability and reliability?`,
      category: 'Generated',
      difficulty: 'Medium',
      stream: 'Custom'
    };

    const result = await db.run(
      'INSERT INTO questions (text, category, difficulty, stream) VALUES (?, ?, ?, ?)',
      [newQuestion.text, newQuestion.category, newQuestion.difficulty, newQuestion.stream]
    );
    
    const savedQuestion = await db.get('SELECT * FROM questions WHERE id = ?', [result.lastID]);
    console.log(`Question generated and saved with ID: ${result.lastID}`);
    res.json(savedQuestion);
  } catch (err) {
    console.error('Generation failure:', err);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

// Get Interviews
app.get('/api/interviews', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const interviews = await db.all('SELECT * FROM interviews WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(interviews);
  } catch (err) {
    console.error('Fetch interviews error:', err);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

// Save Interview
app.post('/api/interviews', async (req, res) => {
  const { userId, title, stream, score, results } = req.body;
  console.log(`Saving interview for User ID: ${userId}, Score: ${score}`);
  
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const resultsStr = typeof results === 'string' ? results : JSON.stringify(results || {});
    const result = await db.run(
      'INSERT INTO interviews (user_id, title, stream, score, results) VALUES (?, ?, ?, ?, ?)',
      [userId, title || 'Mock Interview', stream || 'General', score || 0, resultsStr]
    );
    console.log(`Interview saved successfully. ID: ${result.lastID}`);
    res.json({ id: result.lastID, success: true });
  } catch (err) {
    console.error('Save interview error:', err);
    res.status(500).json({ error: 'Failed to save interview' });
  }
});

// Initialize DB and Start Server
(async () => {
  try {
    db = await getDb();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📁 Local Database: Connected\n`);
    });
  } catch (err) {
    console.error("CRITICAL: Failed to initialize Database. Server not started.", err);
    process.exit(1);
  }
})();
