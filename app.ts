/// <reference types="node" />
// app.ts
import express from "express";
import { Todo } from "./ts/index";
import todosJson from "./__mocks__/todos.json";

const app = express();
const PORT = 3000;
const todos: Todo[] = todosJson;

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

app.get("/todos", (req, res) => {
  res.json(todos);
});


// POST /todos - add a new todo
app.post('/todos', (req, res) => {
  const { task, completed = false } = req.body;

  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  const newTodo = {
    id: todos.length + 1,
    task,
    completed
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});
