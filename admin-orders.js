
const orderList = document.getElementById("orderList");

function money(value) {
    return Number(value || 0).toLocaleString("vi-VN") + " đ";
}

function addText(parent, tag, text, className = "") {
    const el = document.createElement(tag);
    el.textContent = text;

    if (className) el.className = className;

    parent.appendChild(el);
    return el;
}

// Cập nhật trạng thái đơn
function createStatusButton(row, doc, label, nextStatus, isBooking) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.className = "order-action-btn";

    button.onclick = async function () {
        const message = isBooking
            ? "Bạn có chắc muốn cập nhật lịch đặt sân này?"
            : "Bạn có chắc muốn cập nhật đơn hàng này?";

        if (!confirm(message)) return;

        button.disabled = true;
        button.textContent = "Đang cập nhật...";

        try {
            await adminDb.collection("orders").doc(doc.id).update({
                status: nextStatus,
                updatedAt:
                    firebase.firestore.FieldValue.serverTimestamp()
            });

            alert("Đã cập nhật: " + nextStatus);
            await loadOrders();
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Không cập nhật được. Hãy kiểm tra quyền Firestore.");

            button.disabled = false;
            button.textContent = label;
        }
    };

    row.appendChild(button);
}

// XÓA ĐƠN HÀNG HOẶC LỊCH ĐẶT SÂN
function createDeleteButton(row, doc, isBooking) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = "🗑️ Xóa đơn";
    button.className = "order-action-btn delete-order-btn";

    button.onclick = async function () {
        const name = isBooking ? "lịch đặt sân" : "đơn mua sản phẩm";

        if (!confirm(
            `Bạn có chắc muốn xóa ${name} này không?\n` +
            "Dữ liệu sẽ bị xóa khỏi Firestore."
        )) {
            return;
        }

        button.disabled = true;
        button.textContent = "Đang xóa...";

        try {
            await adminDb.collection("orders").doc(doc.id).delete();

            alert("Đã xóa đơn thành công!");
            await loadOrders();
        } catch (error) {
            console.error("Lỗi xóa đơn:", error);

            alert("Không xóa được đơn. Hãy kiểm tra quyền Firestore.");

            button.disabled = false;
            button.textContent = "🗑️ Xóa đơn";
        }
    };

    row.appendChild(button);
}

// Nút trạng thái đơn mua sản phẩm
function renderProductActions(row, doc, status) {
    if (status === "Chờ xác nhận") {
        createStatusButton(row, doc, "✓ Duyệt đơn", "Đã xác nhận", false);
        createStatusButton(row, doc, "✕ Hủy đơn", "Đã hủy", false);
    } else if (status === "Đã xác nhận") {
        createStatusButton(row, doc, "🚚 Bắt đầu giao", "Đang giao", false);
        createStatusButton(row, doc, "✕ Hủy đơn", "Đã hủy", false);
    } else if (status === "Đang giao") {
        createStatusButton(row, doc, "✓ Hoàn thành giao hàng", "Hoàn thành", false);
    } else if (status === "Hoàn thành") {
        addText(row, "p", "✓ Đơn hàng đã giao hoàn thành.");
    } else if (status === "Đã hủy") {
        addText(row, "p", "Đơn hàng đã bị hủy.");
    }
}

// Nút trạng thái đặt sân
function renderBookingActions(row, doc, status) {
    if (status === "Chờ xác nhận") {
        createStatusButton(row, doc, "✓ Xác nhận lịch", "Đã xác nhận", true);
        createStatusButton(row, doc, "✕ Hủy lịch", "Đã hủy", true);
    } else if (status === "Đã xác nhận") {
        createStatusButton(row, doc, "✓ Hoàn thành buổi chơi", "Đã hoàn thành", true);
        createStatusButton(row, doc, "✕ Hủy lịch", "Đã hủy", true);
        addText(row, "p", "Lịch đã được Admin xác nhận.");
    } else if (status === "Đã hoàn thành") {
        addText(row, "p", "✓ Buổi đặt sân đã hoàn thành.");
    } else if (status === "Đã hủy") {
        addText(row, "p", "Lịch đặt sân đã bị hủy.");
    }
}

// Tải danh sách đơn hàng
async function loadOrders() {
    orderList.textContent = "Đang tải đơn hàng...";

    try {
        const snapshot = await adminDb.collection("orders").get();

        orderList.innerHTML = "";

        if (snapshot.empty) {
            orderList.textContent = "Chưa có đơn hàng.";
            return;
        }

        const docs = snapshot.docs.sort((a, b) => {
            const aDate = a.data().createdAt?.toMillis?.() || 0;
            const bDate = b.data().createdAt?.toMillis?.() || 0;
            return bDate - aDate;
        });

        docs.forEach(doc => {
            const order = doc.data();
            const row = document.createElement("div");

            row.className = "order-row";

            const isBooking = order.type === "booking";
            const status = order.status || "Chờ xác nhận";

            addText(row, "h3", "Mã đơn: " + doc.id);

            addText(
                row,
                "p",
                "Khách hàng: " +
                (order.customerEmail || "Khách chưa đăng nhập")
            );

            addText(row, "p", "Trạng thái: " + status);

            if (order.createdAt?.toDate) {
                addText(
                    row,
                    "p",
                    "Ngày tạo: " +
                    order.createdAt.toDate().toLocaleString("vi-VN")
                );
            }

            if (isBooking) {
                // ĐƠN ĐẶT SÂN
                addText(row, "h4", "🏸 Đơn đặt sân");
                addText(row, "p", "Tên sân: " + (order.court || "—"));
                addText(row, "p", "Ngày đặt: " + (order.date || "—"));
                addText(row, "p", "Giờ đặt: " + (order.time || "—"));

                renderBookingActions(row, doc, status);
                createDeleteButton(row, doc, true);
            } else {
                // ĐƠN MUA SẢN PHẨM
                addText(row, "h4", "🛍️ Đơn mua sản phẩm");
                addText(row, "p", "Tổng tiền: " + money(order.total));

                if (Array.isArray(order.items) && order.items.length > 0) {
                    order.items.forEach(item => {
                        const quantity = Number(item.quantity || 1);
                        const price = Number(item.price || 0);

                        addText(
                            row,
                            "p",
                            `${item.name || "Sản phẩm"} × ${quantity} — ` +
                            money(price * quantity)
                        );
                    });
                } else {
                    addText(row, "p", "Chưa có danh sách sản phẩm.");
                }

                renderProductActions(row, doc, status);
                createDeleteButton(row, doc, false);
            }

            row.appendChild(document.createElement("hr"));
            orderList.appendChild(row);
        });
    } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);

        orderList.textContent =
            "Không tải được đơn hàng. Hãy kiểm tra Firebase và quyền Admin.";
    }
}

// Chỉ tải dữ liệu sau khi xác minh quyền Admin
checkAdminAccess()
    .then(ok => {
        if (ok) loadOrders();
    })
    .catch(error => {
        console.error("Lỗi xác minh Admin:", error);
        orderList.textContent = "Không xác minh được quyền Admin.";
    });
