const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8080;

const {
  getUser,
  createUser,
  addFriends,
  deleteUser,
  updateuser,
  login,
} = require("./controller/UserController");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

app.listen(PORT, () => console.log("API running at port 8080"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.post("/user/create", createUser);

app.post("/user/addfriends", addFriends);

app.delete("/user/delete", deleteUser);

app.put("/user/update", updateuser);

app.get("/user/friends", getUser);

app.post("/login", login);
