const express = require("express");
const Comment = require("../schemas/comment");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/postComment", async (req, res) => {
  const { comment, postNumber, userToken } = req.body;
  const decoded = jwt.verify(userToken, "ehdtjs");
  const maxCommentNumber = await Comment.findOne().sort("-number");

  let commentNumber = 1;
  if (maxCommentNumber) {
    commentNumber = maxCommentNumber.commentNumber + 1;
  }
  await Comment.create({
    comment,
    commentNumber,
    postNumber,
    userId: decoded.userId,
  });
  res.json({ success: true, msg: "댓글 작성이 완료되었습니다." });
});

router.post("/getComment", async (req, res) => {
  const { number, userToken } = req.body;
  const comments = await Comment.find({ number });

  if (userToken !== "") {
    const decoded = jwt.verify(userToken, "ehdtjs");
    res.json({ comments, userId: decoded.userId });
  } else {
    res.json({ comments });
  }
});

router.put("/updateComment", async (req, res) => {
  const { commentNumber, comment } = req.body;
  await Comment.updateOne({ commentNumber }, { $set: { comment } });
  res.json({ success: true });
});

router.delete("/deleteComment", async (req, res) => {
  const { commentNumber } = req.body;
  await Comment.deleteOne({ commentNumber });
  res.json({ success: true });
});

module.exports = router;
