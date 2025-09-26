const userService = require("./service");

exports.getUsers = async (_req: any, res: any) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};