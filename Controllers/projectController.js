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

module.exports = { createProject };
