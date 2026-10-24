let url = "https://6a115dca3e35d0f37ee33025.mockapi.io/vs/pp";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const productGrid = document.querySelector(".products");
    if (!productGrid) return;

    productGrid.innerHTML = "";

    const data3 = data.slice(0, 3);

    data3.forEach((product) => {
      let link = "./index.html";

      if (product.id == 1) {
        link = "./lining1.html";
      } else if (product.id == 2) {
        link = "./lining2.html";
      } else if (product.id == 3) {
        link = "./lining3.html";
      }

      const productCard = `
        <div class="card">
          <a href="${link}" class="product-link">
            <img src="${product.image}" alt="${product.name}">
          </a>

          <div class="info">
            <label>Tên đồ: ${product.name}</label>
            <label>Giá tiền: ${product.price} đ</label>
            <button
              type="button"
              class="add-cart"
              data-id="${product.id}"
              data-name="${product.name}"
              data-price="${product.price}"
              data-image="${product.image}"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      `;

      productGrid.innerHTML += productCard;
    });

    // Không gắn sự kiện click ở đây nữa; cart.js sẽ xử lý event delegation cho mọi .add-cart, kể cả khi render động.
  })
  .catch((error) => console.error("Error fetching data:", error));

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