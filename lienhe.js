  window.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.querySelector(".login");
  if (!loginLink) return;

  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) === true;
  loginLink.textContent = isLoggedIn ? "Đăng xuất" : "Đăng nhập";
  loginLink.href = isLoggedIn ? "#" : "login.html";
  loginLink.onclick = isLoggedIn ? logout : null;
});

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  location.href = "login.html";
}