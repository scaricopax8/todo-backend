/// <reference types="node" />
// app.ts
import express from "express";
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


let todos: string[] = [
  'Buy groceries',
  'Trim my beard',
  'Wash my car',
  'Clean my room',
];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const todo = req.body;
  todos.push(todo);
  res.status(201).json(todo);
});
