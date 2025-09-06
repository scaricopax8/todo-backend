/// <reference types="node" />
// app.ts
import express, { Request, Response } from "express";
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
