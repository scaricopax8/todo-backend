/// <reference types="node" />
// app.ts
import express from "express";
const { Pool } = require("pg");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'scarico',
  host: 'localhost',
  database: 'todo_app',
  port: 5432,
});

// Sample route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});


// POST /todos - add a new todo (persist to PostgreSQL)
app.post('/todos', async (req, res) => {
  try {
    const { task, completed = false } = req.body;

    if (typeof task !== 'string' || task.trim() === '') {
      return res.status(400).json({ error: 'Task is required' });
    }

    const insertQuery =
      'INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *';
    const values = [task, completed];

    const result = await pool.query(insertQuery, values);
    const createdTodo = result.rows[0];

    return res.status(201).json(createdTodo);
  } catch (err) {
    console.error('Error creating todo:', err);
    return res.status(500).json({ error: 'Failed to create todo' });
  }
});


// PUT /todos/:id - update a todo (persist to PostgreSQL)
app.put('/todos/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    if (Number.isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { task, completed } = req.body;

    const setClauses: string[] = [];
    const values: any[] = [];

    if (task !== undefined) {
      if (typeof task !== 'string' || task.trim() === '') {
        return res.status(400).json({ error: 'Task must be a non-empty string' });
      }
      values.push(task);
      setClauses.push(`task = $${values.length}`);
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean' });
      }
      values.push(completed);
      setClauses.push(`completed = $${values.length}`);
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    values.push(todoId);
    const updateQuery = `UPDATE todos SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    return res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /todos/:id - delete a todo (persist to PostgreSQL)
app.delete('/todos/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    if (Number.isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [todoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error deleting todo:', err);
    return res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
