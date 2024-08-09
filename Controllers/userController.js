const { UserModel } = require("../Models/userModel");

const registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return;
    } else {
      const newUser = new UserModel(req.body);
      await newUser.save();
      res.status(201).send({ status: `Success`, msg: "User Created" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: `Internal Server Error`, msg: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).send({ status: `Success`, users });
  } catch (error) {
    res
      .status(500)
      .send({ status: `Internal Server Error`, msg: error.message });
  }
};

module.exports = { registerUser, getUsers };
