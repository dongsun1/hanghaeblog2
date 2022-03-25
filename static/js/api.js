function signup() {
  const userId = $("#userId").val();
  const userPw = $("#userPw").val();
  const userPwCheck = $("#userPwCheck").val();

  if (userId === "") {
    alert("이름을 입력해주세요.");
    return;
  } else if (userPw === "" || userPwCheck === "") {
    alert("비밀번호를 입력해주세요.");
    return;
  } else if (userPw !== userPwCheck) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const idCheck = /^[A-Za-z0-9]{3,}$/;

  if (!idCheck.test(userId)) {
    alert("닉네임은 최소 3자 이상, 알파벳 대소문자, 숫자로 구성해야 합니다.");
    return;
  }

  if (userPw.length < 4 || userPw.includes(userId)) {
    alert(
      "비밀번호는 최소 4자 이상이며, 닉네임과 같은 값이 포함되면 안됩니다."
    );
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/signup",
    data: {
      userId: userId,
      userPw: userPw,
    },
    success: function (response) {
      if (response["success"]) {
        alert(response["msg"]);
        location.href = "/";
      } else {
        alert(response["msg"]);
      }
    },
  });
}

function login() {
  const userId = $("#userId").val();
  const userPw = $("#userPw").val();

  if (userId === "") {
    alert("이름을 입력해주세요.");
    return;
  } else if (userPw === "") {
    alert("비밀번호를 입력해주세요.");
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/login",
    data: {
      userId: userId,
      userPw: userPw,
    },
    success: function (response) {
      if (response["success"]) {
        alert(response["msg"]);
        localStorage.setItem("token", response.token);
        location.href = "/article";
      } else {
        alert(response["msg"]);
      }
    },
  });
}

function logout() {
  localStorage.clear();
  location.href = "/";
}

function getSelf(callback) {
  $.ajax({
    type: "GET",
    url: "/api/users/me",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      callback(response.user);
    },
    error: function (xhr, status, error) {
      if (status == 401) {
        alert("로그인이 필요합니다.");
        location.href = "/";
      }
    },
  });
}

function post() {
  const title = $("#title").val();
  const desc = $("#desc").val();
  const userToken = localStorage.getItem("token");
  const date = moment().format("YYYY-MM-DD");

  if (title === "") {
    alert("제목을 입력해주세요.");
    return;
  } else if (desc === "") {
    alert("내용을 입력해주세요.");
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/post",
    data: {
      title: title,
      desc: desc,
      date: date,
      userToken: userToken,
    },
    success: function (response) {
      if (response["success"]) {
        alert(response["msg"]);
        location.href = "/article";
      }
    },
  });
}

function postComment(number) {
  const comment = $("#inputComment").val();
  const userToken = localStorage.getItem("token");

  if (comment === "") {
    alert("댓글을 작성해주세요.");
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/postComment",
    data: {
      comment: comment,
      userToken: userToken,
    },
    success: function (response) {},
  });
}
