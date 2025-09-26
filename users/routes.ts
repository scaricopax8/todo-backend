import express = require("express");

const router = express.Router();

router.get("/", (_req: any, res: any) => {
  res.send("Welcome to the Users API!");
});

module.exports = router;
