/// <reference types="node" />
// app.ts
const express = require("express");

const app = express();

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get("/", (_req: any, res: any) => {
  res.send("Welcome to the Todo API!");
});

const todosRoutes = require("./todos/routes");
app.use("/todos", todosRoutes);

const usersRoutes = require("./users/routes");
app.use("/users", usersRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;