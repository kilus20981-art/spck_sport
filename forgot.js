async function resetPassword() {
    const email = document.getElementById("email").value.trim();
    const button = document.querySelector(".btn");

    if (!email) {
        alert("Vui lòng nhập email đăng ký.");
        return;
    }

    button.disabled = true;

    try {
        await auth.sendPasswordResetEmail(email);
        alert("Nếu email đã đăng ký, liên kết đặt lại mật khẩu sẽ được gửi đến hộp thư của bạn.");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Không thể gửi email đặt lại mật khẩu:", error);
        alert("Không gửi được email đặt lại mật khẩu. Vui lòng kiểm tra email và thử lại.");
    } finally {
        button.disabled = false;
    }
}