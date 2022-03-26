const express = require("express");
const Post = require("../schemas/post");
const Like = require("../schemas/like");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/checkLike", async (req, res) => {
  const { userToken } = req.body;

  if (userToken === "") {
    res.json({ success: false });
  } else {
    const decoded = jwt.verify(userToken, "ehdtjs");
    const userCheck = await Like.findOne({ userId: decoded.userId });
    if (userCheck) {
      res.json({ success: true, userId: decoded.userId });
    } else {
      res.json({ success: false, userId: decoded.userId });
    }
  }
});

router.post("/createLike", async (req, res) => {
  const { postNumber, userId } = req.body;

  await Like.create({ postNumber, userId });
  await Post.update({ postNumber }, { $inc: { like: 1 } });

  res.json({ success: true });
});

router.delete("/deleteLike", async (req, res) => {
  const { postNumber, userId } = req.body;

  await Like.deleteOne({ postNumber, userId });
  await Post.update({ postNumber }, { $inc: { like: -1 } });

  res.json({ success: true });
});

module.exports = router;
