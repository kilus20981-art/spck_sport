const adminAuth = firebase.auth();
const adminDb = firebase.firestore();
let currentAdmin = null;
let authCheckStarted = false;

function checkAdminAccess() {
  if (authCheckStarted) return Promise.resolve(!!currentAdmin);
  authCheckStarted = true;
  document.body.hidden = true;
  return new Promise((resolve) => {
    let settled = false;
    adminAuth.onAuthStateChanged(async (user) => {
      if (settled) return;
      if (!user) {
        settled = true;
        window.location.replace("./admin-login.html");
        resolve(false);
        return;
      }
      try {
        const doc = await adminDb.collection("admins").doc(user.uid).get();
        if (!doc.exists || doc.data().role !== "admin") {
          settled = true;
          alert("Tài khoản của bạn chưa được cấp quyền Admin.");
          await adminAuth.signOut();
          window.location.replace("./admin-login.html");
          resolve(false);
          return;
        }
        currentAdmin = user;
        const email = document.getElementById("adminEmail");
        if (email) email.textContent = "Tài khoản quản trị: " + (user.email || "");
        document.body.hidden = false;
        settled = true;
        resolve(true);
      } catch (error) {
        console.error("Không xác minh được Admin:", error);
        settled = true;
        alert("Không thể xác minh quyền Admin. Hãy kiểm tra Firebase và kết nối mạng.");
        resolve(false);
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", async () => {
    logoutBtn.disabled = true;
    try {
      await adminAuth.signOut();
      window.location.replace("./admin-login.html");
    } catch (error) {
      console.error(error);
      alert("Đăng xuất thất bại.");
      logoutBtn.disabled = false;
    }
  });
});
