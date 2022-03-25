const express = require("express");
const connect = require("./schemas");
const Post = require("./schemas/post");
const cors = require("cors");
const app = express();
const port = 3000;

connect();

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

const requestMiddleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
};

app.use(cors());
app.set("view engine", "ejs");
app.set("views", "./static");
app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleware);

app.use("/api", [usersRouter, postsRouter]);

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/signup", async (req, res) => {
  res.render("signup.ejs");
});

app.get("/article", async (req, res) => {
  const articles = await Post.find({});
  res.render("article.ejs", { articles });
});

app.get("/write", async (req, res) => {
  res.render("write.ejs");
});

app.get("/detail/:number", async (req, res) => {
  const { number } = req.params;
  const detail = await Post.findOne({ number });
  res.render("detail.ejs", { detail });
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요!");
});
