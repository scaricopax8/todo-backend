// CAN YOU DO THIS?

// TODO: Leverage Zod for schema validation
const pool = require("../db");

// TODO: Add some business logic to the controller
// Can you delete a completed todo?
// Can you archive a todo?
// Can you unarchive a todo?
// Can you mark a todo as completed?
// Can you mark a todo as not completed?
// Can you update a todo?
// Can you get a todo by id?

exports.getTodos = async (_req: any, res: any) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id");
    res.json(result.rows);
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

    // Determine completed_at if completed is true and no explicit timestamp provided
    let completedAtValue: any = completed_at;
    if (completed === true && completed_at === null) {
      completedAtValue = new Date();
    }

    // TODO: Pull this out into a service layer
    const insertQuery = `
      INSERT INTO todos (
        task, description, completed, completed_at, due_date, priority, tags, archived
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      task,
      description,
      completed,
      completedAtValue,
      due_date,
      priority,
      tags,
      archived,
    ];

    const result = await pool.query(insertQuery, values);
    const createdTodo = result.rows[0];

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

    const setClauses: string[] = [];
    const values: any[] = [];

    if (task !== undefined) {
      if (typeof task !== "string" || task.trim() === "") {
        return res
          .status(400)
          .json({ error: "Task must be a non-empty string" });
      }
      values.push(task);
      setClauses.push(`task = $${values.length}`);
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return res
          .status(400)
          .json({ error: "Description must be a string or null" });
      }
      values.push(description);
      setClauses.push(`description = $${values.length}`);
    }

    const completedProvided = completed !== undefined;
    if (completedProvided) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean" });
      }
      values.push(completed);
      setClauses.push(`completed = $${values.length}`);
    }

    const completedAtProvided = completed_at !== undefined;
    if (completedAtProvided) {
      if (completed_at !== null && Number.isNaN(Date.parse(completed_at))) {
        return res
          .status(400)
          .json({
            error: "completed_at must be an ISO datetime string or null",
          });
      }
      values.push(completed_at);
      setClauses.push(`completed_at = $${values.length}`);
    } else if (completedProvided) {
      // No explicit completed_at provided, infer based on completed flag
      if (completed === true) {
        setClauses.push(`completed_at = NOW()`);
      } else if (completed === false) {
        setClauses.push(`completed_at = NULL`);
      }
    }

    if (due_date !== undefined) {
      if (due_date !== null && typeof due_date !== "string") {
        return res
          .status(400)
          .json({ error: "due_date must be a YYYY-MM-DD string or null" });
      }
      values.push(due_date);
      setClauses.push(`due_date = $${values.length}`);
    }

    if (priority !== undefined) {
      const allowedPriorities = new Set(["low", "medium", "high"]);
      if (!allowedPriorities.has(priority)) {
        return res
          .status(400)
          .json({ error: "priority must be one of 'low','medium','high'" });
      }
      values.push(priority);
      setClauses.push(`priority = $${values.length}`);
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
      values.push(tags);
      setClauses.push(`tags = $${values.length}`);
    }

    if (archived !== undefined) {
      if (typeof archived !== "boolean") {
        return res.status(400).json({ error: "archived must be a boolean" });
      }
      values.push(archived);
      setClauses.push(`archived = $${values.length}`);
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    // Always update the updated_at timestamp
    setClauses.push("updated_at = NOW()");

    values.push(todoId);
    const updateQuery = `UPDATE todos SET ${setClauses.join(
      ", "
    )} WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.json(result.rows[0]);
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

    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [todoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting todo:", err);
    return res.status(500).json({ error: "Failed to delete todo" });
  }
};
