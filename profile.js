window.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) === true;
  const user = JSON.parse(localStorage.getItem("user"));
  const btnLogin = document.querySelector(".login");

  if (!isLoggedIn || !user) {
    window.location.replace("login.html");
    return;
  }

  if (btnLogin) btnLogin.textContent = "Đăng xuất";
  console.log(user.username);
  console.log(user.email);
  console.log(user.uid);



  // Đổ dữ liệu ra input
  document.getElementById("input-username").value = user.username || "";
  document.getElementById("input-email").value = user.email || "";

  // Lưu thay đổi
  document.getElementById("btn-save-profile").addEventListener("click", async () => {
    const newUsername = document.getElementById("input-username").value.trim();
    const newEmail = document.getElementById("input-email").value.trim();

    if (!newUsername || !newEmail) return alert("Điền đầy đủ thông tin!");

    try {
      await db.collection("users").doc(user.uid).update({
        username: newUsername,
        email: newEmail
      });

      // Cập nhật lại localStorage
      user.username = newUsername;
      user.email = newEmail;
      localStorage.setItem("user", JSON.stringify(user));

      alert("Cập nhật thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  });
});
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  location.href = "login.html";
}