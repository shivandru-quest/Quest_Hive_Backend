const express = require("express");
const {
  createProject,
  getProjects,
} = require("../Controllers/projectController");
const { upload } = require("../Middlewares/multerConfig");
const { authorizedRole } = require("../Middlewares/roleAuth");
const { roleQuery } = require("../Middlewares/roleSetQuery");
const projectRouter = express.Router();
projectRouter.post("/create", upload.single("attachment"), createProject);

projectRouter.get(
  "/",
  roleQuery,
  authorizedRole([
    "Super Admin",
    "Project Manager",
    "Developer",
    "Ui Ux Designer",
  ]),
  getProjects
);
module.exports = { projectRouter };
