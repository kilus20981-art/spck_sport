/* ================================
   SLIDER
================================ */

let slideIndex = 0;

const slides = document.querySelectorAll(".slide");

function showSlide() {

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    slideIndex++;

    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }

    slides[slideIndex].classList.add("active");
}

if (slides.length > 0) {
    setInterval(showSlide, 3000);
}


/* ================================
   COUNTDOWN
================================ */

// Thời gian kết thúc:
// 2 ngày kể từ lúc mở trang
const endTime =
    new Date().getTime() +
    (2 * 24 * 60 * 60 * 1000);


function updateCountdown() {

    const now = new Date().getTime();

    const distance = endTime - now;


    if (distance <= 0) {

        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        return;
    }


    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        / 1000
    );


    document.getElementById("days").innerText =
        String(days).padStart(2, "0");

    document.getElementById("hours").innerText =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").innerText =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").innerText =
        String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);


/* ================================
   COPY VOUCHER
================================ */

function copyCode(code) {

    navigator.clipboard.writeText(code)

        .then(() => {

            alert(
                "Đã sao chép mã: " + code
            );

        })

        .catch(() => {

            alert(
                "Mã giảm giá: " + code
            );

        });
}

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