const express = require("express");
const { createProject } = require("../Controllers/projectController");
const upload = require("../Middlewares/multerConfig");
const projectRouter = express.Router();
projectRouter.post("/create", upload.single("attachment"), createProject);
module.exports = { projectRouter };
