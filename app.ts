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

const todosRoutes = require("./routes/todosRoutes");
app.use("/todos", todosRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
