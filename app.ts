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


// PUT /todos/:id - update a todo
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const { task, completed } = req.body;

  const todo = todos.find(t => t.id === todoId);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

// DELETE /todos/:id - delete a todo
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === todoId);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(index, 1);
  res.json(deletedTodo[0]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
