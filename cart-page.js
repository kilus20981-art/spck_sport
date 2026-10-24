
 // ===============================
 // GIỎ HÀNG + TẠO ĐƠN HÀNG FIRESTORE
 // ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartList = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");

// Hiển thị thông báo an toàn
function showMessage(message) {
    alert(message);
}

// Tính tổng tiền
function calculateTotal() {
    return cart.reduce((sum, item) => {
        return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
}

// Hiển thị giỏ hàng
function renderCart() {
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = "<h2>🛒 Giỏ hàng đang trống</h2>";
        totalPrice.textContent = "0 đ";
        return;
    }

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const img = document.createElement("img");
        img.src = item.image || "";
        img.alt = item.name || "Sản phẩm";

        const info = document.createElement("div");
        info.className = "cart-info";

        const name = document.createElement("h3");
        name.textContent = item.name || "Sản phẩm";

        const price = document.createElement("p");
        price.textContent =
            Number(item.price || 0).toLocaleString("vi-VN") + " đ";

        const quantity = document.createElement("div");
        quantity.className = "quantity";

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.onclick = () => decrease(index);

        const number = document.createElement("span");
        number.textContent = Number(item.quantity || 1);

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.onclick = () => increase(index);

        quantity.append(minus, number, plus);
        info.append(name, price, quantity);

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "❌";
        remove.onclick = () => removeItem(index);

        row.append(img, info, remove);
        cartList.appendChild(row);
    });

    totalPrice.textContent =
        calculateTotal().toLocaleString("vi-VN") + " đ";

    localStorage.setItem("cart", JSON.stringify(cart));
}

// Tăng số lượng
function increase(index) {
    cart[index].quantity = Number(cart[index].quantity || 1) + 1;
    renderCart();
}

// Giảm số lượng
function decrease(index) {
    if (Number(cart[index].quantity || 1) > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    renderCart();
}

// Xóa sản phẩm
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// Thanh toán và lưu đơn hàng lên Firestore
checkoutBtn.onclick = async function () {
    if (cart.length === 0) {
        showMessage("Giỏ hàng đang trống!");
        return;
    }

    // Kiểm tra Firebase đã khởi tạo chưa
    if (typeof firebase === "undefined" ||
        !firebase.apps.length ||
        typeof firebase.firestore !== "function") {
        showMessage("Firebase chưa được khởi tạo. Hãy kiểm tra firebase.js!");
        return;
    }

    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Đang tạo đơn hàng...";

    try {
        const db = firebase.firestore();
        const auth = firebase.auth();
        const currentUser = auth.currentUser;

        // Chỉ lưu các thông tin cần thiết của sản phẩm
        const items = cart.map(item => ({
            id: String(item.id || ""),
            name: String(item.name || "Sản phẩm"),
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            image: String(item.image || "")
        }));

        const total = calculateTotal();

        const order = {
            items: items,
            total: total,
            status: "Chờ xác nhận",
            customerEmail: currentUser ? currentUser.email : "",
            customerId: currentUser ? currentUser.uid : "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Tạo một đơn hàng mới, không ghi đè đơn cũ
        const docRef = await db.collection("orders").add(order);

        // Chỉ xóa giỏ hàng sau khi lưu thành công
        cart = [];
        localStorage.removeItem("cart");
        renderCart();

        showMessage(
            "Đặt hàng thành công!\nMã đơn hàng: " + docRef.id +
            "\nTổng tiền: " + total.toLocaleString("vi-VN") + " đ"
        );

    } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error);

        showMessage(
            "Không thể lưu đơn hàng lên Firebase.\n" +
            "Ní kiểm tra kết nối và Firestore Rules nhé."
        );
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = "Thanh toán";
    }
};

// Khởi chạy
renderCart();
