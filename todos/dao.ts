// Actual DB implementation would go here
const pool = require("../db");
import { Todo } from "../ts";

exports.findAll = async () => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id");
  return result.rows;
};

exports.create = async (todo: Todo) => {
  const {
    task,
    description,
    completed,
    completed_at,
    due_date,
    priority,
    tags,
    archived,
  } = todo;
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
    completed_at,
    due_date,
    priority,
    tags,
    archived,
  ];
  const result = await pool.query(insertQuery, values);
  return result.rows[0];
};

exports.update = async (id: number, todo: Todo) => {
  const setClauses = Object.keys(todo)
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(", ");
  const values = Object.values(todo);
  values.push(id);
  const updateQuery = `UPDATE todos SET ${setClauses}, "updated_at" = NOW() WHERE id = $${values.length} RETURNING *`;
  const result = await pool.query(updateQuery, values);
  return result.rows[0];
};

exports.remove = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM todos WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};