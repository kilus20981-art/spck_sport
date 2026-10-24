console.log("cart.js đã chạy");

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

document.addEventListener("click", function (event) {
    const button = event.target.closest(".add-cart");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price || 0),
        image: button.dataset.image,
        quantity: 1
    };

    const cart = getCart();
    const index = cart.findIndex(item => String(item.id) === String(product.id));

    if (index !== -1) {
        cart[index].quantity = Number(cart[index].quantity || 1) + 1;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    updateCartCount();
    alert("✅ Đã thêm vào giỏ hàng!");
});

updateCartCount();


window.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.querySelector(".login");
    if (!btnLogin) return;

    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) === true;
    btnLogin.textContent = isLoggedIn ? "Đăng xuất" : "Đăng nhập";
    btnLogin.href = isLoggedIn ? "#" : "login.html";
    btnLogin.onclick = isLoggedIn ? logout : null;
});

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  location.href = "login.html";
}
