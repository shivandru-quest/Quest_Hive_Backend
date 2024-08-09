const { registerUser, getUsers } = require("../Controllers/userController");
const express = require("express");
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/", getUsers);
module.exports = { userRouter };
