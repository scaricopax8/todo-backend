const pool = require("../db");

exports.getUsers = async () => {
  const result = await pool.query("SELECT * FROM users ORDER BY id");
  return result.rows;
};