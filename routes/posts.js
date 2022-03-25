const express = require("express");
const Post = require("../schemas/post");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/post", async (req, res) => {
  const { title, desc, date, userToken } = req.body;
  const maxNumber = await Post.findOne().sort("-number");

  let number = 1;
  if (maxNumber) {
    number = maxNumber.number + 1;
  }

  let like = 0;

  const decoded = jwt.verify(userToken, "ehdtjs");

  await Post.create({
    title,
    desc,
    number,
    date,
    like,
    userId: decoded.userId,
  });
  res.json({ success: true, msg: "게시글 작성이 완료되었습니다." });
});

module.exports = router;
