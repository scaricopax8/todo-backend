// Q: Is this the right way to import express?
import express = require("express");

const router = express.Router();
const controller = require("./controller");

router.get("/", controller.getTodos);
router.post("/", controller.createTodo);
router.put("/:id", controller.updateTodo);
router.delete("/:id", controller.deleteTodo);

module.exports = router;
