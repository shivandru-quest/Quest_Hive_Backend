const mongoose = require("mongoose");

const AssigneeSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const ProjectSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  sprintPoints: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  assignee: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  ],
  priority: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  attachment: {
    data: Buffer,
    contentType: String,
  },
});

const ProjectModel = mongoose.model("project", ProjectSchema);

module.exports = { ProjectModel };
