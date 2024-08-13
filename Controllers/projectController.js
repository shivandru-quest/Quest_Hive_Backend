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
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 3;
    let sortBy = req.query.sortBy || "priority";
    let sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    if (page < 1) page = 1;
    if (limit < 1) limit = 3;
    let projectQuery = {};
    if (role === "Super Admin" || role === "Project Manager") {
      projectQuery = {};
    } else if (role === "Developer" || role === "Ui Ux Designer") {
      projectQuery = { assignee: objectId };
    } else {
      return res.status(403).send(`Forbidden: Access denied for role ${role}`);
    }
    const filter = req.query.filters;
    if (filter) {
      if (["urgent", "high", "normal", "low"].includes(filter)) {
        projectQuery.priority = filter;
      } else if (["todo", "in-process", "closed"].includes(filter)) {
        projectQuery.status = filter;
      } else if (
        ["research", "design", "review", "code", "testing"].includes(filter)
      ) {
        projectQuery.tag = filter;
      }
    }
    const totalProjects = await ProjectModel.countDocuments(projectQuery);
    const totalPages = Math.ceil(totalProjects / limit);
    if (page > totalPages) {
      return res.status(200).send({
        status: `Success`,
        projects: [],
        pagination: {
          total: totalProjects,
          page,
          limit,
          totalPages,
        },
      });
    }
    let sortOptions = {};
    if (sortBy === "priority") {
      sortOptions = {
        priorityOrder: sortOrder,
      };
    } else if (sortBy === "status") {
      sortOptions = {
        statusOrder: sortOrder,
      };
    } else if (sortBy === "tag") {
      sortOptions = {
        tagsOrder: sortOrder,
      };
    }
    const projects = await ProjectModel.aggregate([
      { $match: projectQuery },
      {
        $addFields: {
          priorityOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "urgent"] }, then: 1 },
                { case: { $eq: ["$priority", "high"] }, then: 2 },
                { case: { $eq: ["$priority", "normal"] }, then: 3 },
                { case: { $eq: ["$priority", "low"] }, then: 4 },
              ],
              default: 5,
            },
          },
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "todo"] }, then: 1 },
                { case: { $eq: ["$status", "in-process"] }, then: 2 },
                { case: { $eq: ["$status", "closed"] }, then: 3 },
              ],
              default: 4,
            },
          },
          tagsOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$tag", "research"] }, then: 1 },
                { case: { $eq: ["$tag", "design"] }, then: 2 },
                { case: { $eq: ["$tag", "review"] }, then: 3 },
                { case: { $eq: ["$tag", "code"] }, then: 4 },
                { case: { $eq: ["$tag", "testing"] }, then: 5 },
              ],
              default: 6,
            },
          },
        },
      },
      { $sort: sortOptions },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { priorityOrder: 0, statusOrder: 0, tagsOrder: 0 } },
    ]);
    res.status(200).send({
      status: `Success`,
      projects,
      pagination: {
        total: totalProjects,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "An error occurred.",
      msg: error.message,
    });
  }
};

const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).send({ status: `Error`, msg: "Project not found" });
    } else {
      res.status(200).send({ status: `Success`, project });
    }
  } catch (error) {
    res.status(500).send({
      status: "An error occurred.",
      msg: error.message,
    });
  }
};

module.exports = { createProject, getProjects, getProject };
