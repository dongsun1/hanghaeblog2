const express = require("express");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { userId, userPw } = req.body;

  const userCheck = await User.findOne({ userId });

  if (userCheck) {
    res.json({ success: false, msg: "중복된 닉네임입니다." });
  } else {
    await User.create({ userId, userPw });
    res.json({ success: true, msg: "회원가입에 성공하였습니다." });
  }
});

router.post("/login", async (req, res) => {
  const { userId, userPw } = req.body;

  const loginCheck = await User.findOne({ userId, userPw });

  if (!loginCheck) {
    res.json({ success: false, msg: "닉네임 또는 패스워드를 확인해주세요." });
  } else {
    const token = jwt.sign({ userId: loginCheck.userId }, "ehdtjs");
    res.json({ success: true, msg: "로그인에 성공하였습니다.", token: token });
  }
});

router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({ user });
});

module.exports = router;
