const { registerUser } = require("../Controllers/userController");
const express = require("express");
const userRouter = express.Router();
userRouter.post("/register", registerUser);
module.exports = { userRouter };
