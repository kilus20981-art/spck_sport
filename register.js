
// Lấy form đăng kí ra kiểm tra được mới làm tiếp
const form = document.querySelector("#register-form");


// Thêm sự kiện cho form đăng kí
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Lấy ra 4 trường thuộc tính: email, name, pass, confirmpass
  const email = form.querySelector("#email").value.trim().toLowerCase();
  const username = form.querySelector("#username").value.trim();
  const password = form.querySelector("#password").value.trim();
  const phone = form.querySelector("#phone").value.trim();

  if (!email || !username || !password || !phone) {
    alert("Vui long nhap day du thong tin");
    return;
  }

 firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      let userData = {
                username,
                email,
                password,
                phone,
                provider: "email",
                role_id: "user",
                uid: user.uid
            }
        db.collection("users").add(userData)
                .then((docRef) => {
                    alert("Đăng ký thành công");
                    location.href = "./login.html";
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    alert("Đăng ký thất bại");
                    console.error("Error adding document: ", error);
                });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage)
    });
});
