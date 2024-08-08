const mongoose = require("mongoose");
const roles = ["Super Admin", "Developer", "Ui Ux Designer", "Project Manager"];
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: roles,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = mongoose.model("users", userSchema);
module.exports = { UserModel };
