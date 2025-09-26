// TODO: Add Zod schema validation

const todoService = require("./service");

exports.getTodos = async (_req: any, res: any) => {
  try {
    const todos = await todoService.getTodos();
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// POST /todos - add a new todo (persist to PostgreSQL)
exports.createTodo = async (req: any, res: any) => {
  try {
    const {
      task,
      description = null,
      completed = false,
      completed_at = null,
      due_date = null,
      priority = "medium",
      tags = [],
      archived = false,
    } = req.body || {};

    if (typeof task !== "string" || task.trim() === "") {
      return res.status(400).json({ error: "Task is required" });
    }

    if (description !== null && typeof description !== "string") {
      return res
        .status(400)
        .json({ error: "Description must be a string or null" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be a boolean" });
    }

    if (completed_at !== null && Number.isNaN(Date.parse(completed_at))) {
      return res
        .status(400)
        .json({ error: "completed_at must be an ISO datetime string or null" });
    }

    if (due_date !== null) {
      if (typeof due_date !== "string") {
        return res
          .status(400)
          .json({ error: "due_date must be a YYYY-MM-DD string or null" });
      }
    }

    const allowedPriorities = new Set(["low", "medium", "high"]);
    if (!allowedPriorities.has(priority)) {
      return res
        .status(400)
        .json({ error: "priority must be one of 'low','medium','high'" });
    }

    if (
      !Array.isArray(tags) ||
      !tags.every((t: any) => typeof t === "string")
    ) {
      return res
        .status(400)
        .json({ error: "tags must be an array of strings" });
    }

    if (typeof archived !== "boolean") {
      return res.status(400).json({ error: "archived must be a boolean" });
    }

    const createdTodo = await todoService.createTodo({
      task,
      description,
      completed,
      completed_at,
      due_date,
      priority,
      tags,
      archived,
    });

    return res.status(201).json(createdTodo);
  } catch (err) {
    console.error("Error creating todo:", err);
    return res.status(500).json({ error: "Failed to create todo" });
  }
};

// PUT /todos/:id - update a todo (persist to PostgreSQL)
exports.updateTodo = async (req: any, res: any) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    if (Number.isNaN(todoId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const {
      task,
      description,
      completed,
      completed_at,
      due_date,
      priority,
      tags,
      archived,
    } = req.body || {};

    const updateData = {};
    if (task !== undefined) {
      if (typeof task !== "string" || task.trim() === "") {
        return res
          .status(400)
          .json({ error: "Task must be a non-empty string" });
      }
      Object.assign(updateData, { task });
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return res
          .status(400)
          .json({ error: "Description must be a string or null" });
      }
      Object.assign(updateData, { description });
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean" });
      }
      Object.assign(updateData, { completed });
    }

    if (completed_at !== undefined) {
      if (completed_at !== null && Number.isNaN(Date.parse(completed_at))) {
        return res
          .status(400)
          .json({
            error: "completed_at must be an ISO datetime string or null",
          });
      }
      Object.assign(updateData, { completed_at });
    }

    if (due_date !== undefined) {
      if (due_date !== null && typeof due_date !== "string") {
        return res
          .status(400)
          .json({ error: "due_date must be a YYYY-MM-DD string or null" });
      }
      Object.assign(updateData, { due_date });
    }

    if (priority !== undefined) {
      const allowedPriorities = new Set(["low", "medium", "high"]);
      if (!allowedPriorities.has(priority)) {
        return res
          .status(400)
          .json({ error: "priority must be one of 'low','medium','high'" });
      }
      Object.assign(updateData, { priority });
    }

    if (tags !== undefined) {
      if (
        !Array.isArray(tags) ||
        !tags.every((t: any) => typeof t === "string")
      ) {
        return res
          .status(400)
          .json({ error: "tags must be an array of strings" });
      }
      Object.assign(updateData, { tags });
    }

    if (archived !== undefined) {
      if (typeof archived !== "boolean") {
        return res.status(400).json({ error: "archived must be a boolean" });
      }
      Object.assign(updateData, { archived });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const updatedTodo = await todoService.updateTodo(todoId, updateData);

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.json(updatedTodo);
  } catch (err) {
    console.error("Error updating todo:", err);
    return res.status(500).json({ error: "Failed to update todo" });
  }
};

// DELETE /todos/:id - delete a todo (persist to PostgreSQL)
exports.deleteTodo = async (req: any, res: any) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    if (Number.isNaN(todoId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deletedTodo = await todoService.deleteTodo(todoId);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.json(deletedTodo);
  } catch (err) {
    console.error("Error deleting todo:", err);
    return res.status(500).json({ error: "Failed to delete todo" });
  }
};
