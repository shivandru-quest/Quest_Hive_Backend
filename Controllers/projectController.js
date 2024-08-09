const mongoose = require("mongoose");
const { ProjectModel } = require("../Models/projectModel");

const createProject = async (req, res) => {
  try {
    const {
      title,
      status,
      sprintPoints,
      dueDate,
      priority,
      tag,
      description,
      assignee,
    } = req.body;

    const newProject = new ProjectModel({
      title,
      status,
      sprintPoints,
      dueDate,
      priority,
      tag,
      description,
      assignee: JSON.parse(assignee),
    });

    if (req.file) {
      newProject.attachment.data = req.file.buffer;
      newProject.attachment.contentType = req.file.mimetype;
    }

    const savedProject = await newProject.save();

    res.status(201).send({
      status: "success",
      msg: savedProject,
    });
  } catch (error) {
    res.status(500).send({
      status: "An error occurred while creating the project.",
      msg: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const role = req.role;
    const userId = req.userId;
    const objectId = new mongoose.Types.ObjectId(userId);
    if (!role || !userId) {
      return res.status(401).send(`Unauthorized: Role or userId not set`);
    }
    let projects;
    if (role === "Super Admin" || role === "Project Manager") {
      projects = await ProjectModel.find();
    } else if (role === "Developer" || role === "Ui Ux Designer") {
      projects = await ProjectModel.find({ assignee: objectId });
    } else {
      return res.status(403).send(`Forbidden: Access denied for role ${role}`);
    }
    res.status(200).send({ status: `Success`, projects });
  } catch (error) {
    res.status(500).send({
      status: "An error occurred.",
      msg: error.message,
    });
  }
};

module.exports = { createProject, getProjects };
