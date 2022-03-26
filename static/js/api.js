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

function loginCheck(method) {
  const userToken = localStorage.getItem("token");
  if (!userToken) {
    alert("로그인이 필요합니다.");
    location.href = "/";
    return;
  }

  if (method === "write") {
    location.href = "/write";
    return;
  }
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

function postComment(postNumber) {
  const comment = $("#inputComment").val();
  const userToken = localStorage.getItem("token");

  if (!userToken) {
    alert("로그인이 필요합니다.");
    location.href = "/";
    return;
  }

  if (comment === "") {
    alert("댓글을 작성해주세요.");
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/postComment",
    data: {
      postNumber: postNumber,
      comment: comment,
      userToken: userToken,
    },
    success: function (response) {
      location.reload();
    },
  });
}

function getComment(number) {
  const userToken = localStorage.getItem("token");
  const commentList = $("#commentList");

  $.ajax({
    type: "POST",
    url: "/api/getComment",
    data: {
      number: number,
      userToken: userToken,
    },
    success: function (response) {
      const rows = response["comments"];
      const userId = response["userId"];
      for (let i = 0; i < rows.length; i++) {
        let temp;
        if (userId === rows[i].userId) {
          temp = `
          <div class="commentList">
            <div class="commentUser">
              <div class="userId">${rows[i].userId}</div>
              <div class="comment">${rows[i].comment}</div>
            </div>
            <div class="commentBtn">
              <button class="commentUpdate btn btn-default" onclick="updateComment(${rows[i].commentNumber})">수정</button>
              <button class="commentDelete btn btn-default" onclick="deleteComment(${rows[i].commentNumber})">삭제</button>
            </div>
          </div>
          <hr />
        `;
        } else {
          temp = `
          <div class="commentList">
            <div class="commentUser">
              <div class="userId">${rows[i].userId}</div>
              <div class="comment">${rows[i].comment}</div>
            </div>
          </div>
          <hr />
        `;
        }
        commentList.append(temp);
      }
    },
  });
}

function updateComment(commentNumber) {
  const comment = prompt("수정할 댓글을 작성해주세요.");

  if (comment === "") {
    alert("빈칸입니다.");
    return;
  }

  $.ajax({
    type: "PUT",
    url: "/api/updateComment",
    data: {
      commentNumber,
      comment,
    },
    success: function (response) {
      location.reload();
    },
  });
}

function deleteComment(commentNumber) {
  const check = confirm("정말로 삭제하시겠습니까?");

  if (!check) {
    return;
  }

  $.ajax({
    type: "DELETE",
    url: "/api/deleteComment",
    data: {
      commentNumber,
    },
    success: function (response) {
      location.reload();
    },
  });
}

function checkLike(postNumber) {
  const userToken = localStorage.getItem("token");
  const like = $("#like");

  $.ajax({
    type: "POST",
    url: "/api/checkLike",
    data: {
      userToken,
    },
    success: function (response) {
      let temp;
      const userId = response["userId"];
      if (response["success"]) {
        temp = `<div id="btnLike" onclick='deleteLike(${postNumber}, ${userId})'>❤</div>`;
      } else {
        temp = `<div id="btnLike" onclick='createLike(${postNumber}, ${userId})'>🤍</div>`;
      }
      like.append(temp);
    },
  });
}

function createLike(postNumber, userId) {
  const userToken = localStorage.getItem("token");

  if (userToken === "") {
    alert("로그인이 필요합니다.");
    location.href = "/";
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/createLike",
    data: {
      postNumber: postNumber,
      userId: userId,
    },
    success: function (response) {
      location.reload();
    },
  });
}

function deleteLike(postNumber, userId) {
  $.ajax({
    type: "DELETE",
    url: "/api/deleteLike",
    data: {
      postNumber: postNumber,
      userId: userId,
    },
    success: function (response) {
      location.reload();
    },
  });
}
