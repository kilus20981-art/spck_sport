let url = "https://6a115dca3e35d0f37ee33025.mockapi.io/vs/pp";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const productGrid = document.querySelector(".products");
    if (!productGrid) return;

    productGrid.innerHTML = "";

    const data3 = data.slice(3, 6);

    data3.forEach((product) => {
      let link = "./phukien.html";

      if (product.id == 4) {
        link = "./phukien1.html";
      } else if (product.id == 5) {
        link = "./phukien2.html";
      } else if (product.id == 6) {
        link = "./phukien3.html";
      }

      const productCard = `
        <div class="card">
          <a href="${link}" class="product-link">
            <img src="${product.image}" alt="${product.name}">
          </a>

          <div class="info">
            <label>Tên đồ: ${product.name}</label>
            <label>Giá tiền: ${product.price}</label>
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

    // Để tránh gắn listener trùng lặp, xử lý thêm vào giỏ được thực hiện toàn bộ trong cart.js thông qua event delegation.
  })
  .catch((error) => console.error(error));

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



  