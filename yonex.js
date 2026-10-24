
let url = "https://6a115dca3e35d0f37ee33025.mockapi.io/vs/pp";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const productGrid = document.querySelector(".products");
    if (!productGrid) return;

    productGrid.innerHTML = "";

    data.slice(6, 9).forEach((product) => {
      let link = "./yonex.html";

      if (product.id == 7) {
        link = "./yonex1.html";
      } else if (product.id == 8) {
        link = "./yonex2.html";
      } else if (product.id == 9) {
        link = "./yonex3.html";
      }

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <a class="product-link" href="${link}">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
        </a>
        <p class="price">${product.price}</p>
        <button
          type="button"
          class="add-cart"
          data-id="${product.id}"
          data-name="${product.name}"
          data-price="${product.price}"
          data-image="${product.image}">
          🛒 Thêm vào giỏ hàng
        </button>
      `;

      productGrid.appendChild(productCard);

      const button = productCard.querySelector(".add-cart");
      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();

          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const productData = {
            id: this.dataset.id,
            name: this.dataset.name,
            price: Number(this.dataset.price || 0),
            image: this.dataset.image,
            quantity: 1
          };

          const index = cart.findIndex(item => String(item.id) === String(productData.id));
          if (index !== -1) {
            cart[index].quantity += 1;
          } else {
            cart.push(productData);
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          const countEl = document.getElementById("cart-count");
          if (countEl) {
            countEl.textContent = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
          }

          alert("✅ Đã thêm vào giỏ hàng!");
        });
      }
    });
  })
  .catch((error) => {
    console.error("Lỗi khi lấy dữ liệu:", error);
  });

