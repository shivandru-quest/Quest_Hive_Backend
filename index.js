const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./Configs/db");
const { userRouter } = require("./Routes/userRoute");
const { projectRouter } = require("./Routes/projectRoute");
const PORT = process.env.PORT;
const app = express();
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/user", userRouter);
app.use("/projects", projectRouter);
app.get("/", (req, res) => {
  res.status(201).send("Quest Hive");
});
app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server is running on port ${PORT} MongoAtlas Connected...`);
  } catch (error) {
    console.error({ err: error.message });
  }
});
