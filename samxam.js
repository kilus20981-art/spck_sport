
window.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("bookingDate");
    const timeSelect = document.getElementById("bookingTime");
    const bookBtn = document.getElementById("bookBtn");
    const message = document.getElementById("bookingMessage");
    const bookingList = document.getElementById("bookingList");

    // ĐỔI tên này theo từng file
    const courtName = "Sân xám đa năng";

    const db = firebase.firestore();
    const auth = firebase.auth();

    function getToday() {
        const now = new Date();

        return now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");
    }

    dateInput.min = getToday();

    function showMessage(text) {
        message.textContent = text;
    }

    // Lấy lịch đặt của sân từ Firestore
    async function getBookings() {
        const snapshot = await db.collection("orders").get();

        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(item =>
                item.type === "booking" &&
                item.court === courtName
            );
    }

    // Hiển thị lịch đặt
    async function displayBookings() {
        bookingList.textContent = "Đang tải lịch đặt...";

        try {
            const bookings = await getBookings();

            bookingList.innerHTML = "";

            const activeBookings = bookings.filter(
                booking => booking.status !== "Đã hủy"
            );

            if (activeBookings.length === 0) {
                bookingList.textContent = "Chưa có lịch đặt sân.";
                return;
            }

            activeBookings.sort((a, b) =>
                (a.date + a.time).localeCompare(b.date + b.time)
            );

            activeBookings.forEach(booking => {
                const item = document.createElement("div");
                const info = document.createElement("p");

                info.textContent =
                    booking.date + " | " + booking.time +
                    " | " + (booking.status || "Chờ xác nhận");

                item.appendChild(info);

                // Khách chỉ được hủy lịch đang chờ xác nhận
                if (booking.status === "Chờ xác nhận") {
                    const cancelBtn = document.createElement("button");
                    cancelBtn.textContent = "Hủy lịch";

                    cancelBtn.onclick = async function () {
                        if (!confirm("Bạn muốn hủy lịch này?")) return;

                        cancelBtn.disabled = true;

                        try {
                            await db.collection("orders")
                                .doc(booking.id)
                                .update({
                                    status: "Đã hủy",
                                    updatedAt:
                                        firebase.firestore.FieldValue.serverTimestamp()
                                });

                            showMessage("Đã hủy lịch đặt sân.");
                            await displayBookings();
                        } catch (error) {
                            console.error(error);
                            showMessage("Không hủy được lịch. Vui lòng thử lại.");
                            cancelBtn.disabled = false;
                        }
                    };

                    item.appendChild(cancelBtn);
                }

                bookingList.appendChild(item);
            });
        } catch (error) {
            console.error("Lỗi tải lịch đặt:", error);
            bookingList.textContent =
                "Không tải được lịch. Hãy kiểm tra Firebase và Firestore Rules.";
        }
    }

    // Tạo lịch đặt mới
    bookBtn.addEventListener("click", async function () {
        if (!auth.currentUser) {
            showMessage(
                "Bạn cần đăng nhập bằng tài khoản Firebase trước khi đặt sân."
            );
            return;
        }

        const selectedDate = dateInput.value;
        const selectedTime = timeSelect.value;

        if (!selectedDate) {
            showMessage("Vui lòng chọn ngày đặt sân.");
            return;
        }

        if (selectedDate < getToday()) {
            showMessage("Ngày đặt sân không hợp lệ.");
            return;
        }

        if (!selectedTime) {
            showMessage("Vui lòng chọn giờ đặt sân.");
            return;
        }

        bookBtn.disabled = true;
        showMessage("Đang kiểm tra lịch trống...");

        try {
            const bookings = await getBookings();

            const isBooked = bookings.some(booking =>
                booking.date === selectedDate &&
                booking.time === selectedTime &&
                booking.status !== "Đã hủy"
            );

            if (isBooked) {
                showMessage("Khung giờ này đã được đặt. Hãy chọn giờ khác.");
                return;
            }

            await db.collection("orders").add({
                type: "booking",
                court: courtName,
                date: selectedDate,
                time: selectedTime,
                customerId: auth.currentUser.uid,
                customerEmail: auth.currentUser.email || "",
                total: 0,
                status: "Chờ xác nhận",
                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()
            });

            showMessage(
                "Đã gửi yêu cầu đặt sân! Vui lòng chờ Admin xác nhận."
            );

            await displayBookings();
        } catch (error) {
            console.error("Lỗi đặt sân:", error);
            showMessage(
                "Đặt sân thất bại. Hãy kiểm tra kết nối và quyền Firestore."
            );
        } finally {
            bookBtn.disabled = false;
        }
    });

    // Cập nhật navbar
    const loginLink = document.querySelector("#loginMenu a");

    if (loginLink) {
        const loggedIn =
            JSON.parse(localStorage.getItem("isLoggedIn")) === true;

        loginLink.textContent = loggedIn ? "Đăng xuất" : "Đăng nhập";
        loginLink.href = loggedIn ? "#" : "./login.html";

        if (loggedIn) {
            loginLink.onclick = function (event) {
                event.preventDefault();
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("user");
                auth.signOut().finally(() => {
                    location.href = "./login.html";
                });
            };
        }
    }

    displayBookings();
});
