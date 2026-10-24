
const PRODUCT_API =
  "https://6a115dca3e35d0f37ee33025.mockapi.io/vs/pp";

const productList = document.getElementById("productList");
const productMessage = document.getElementById("productMessage");

// Chuyển giá thành định dạng tiền Việt Nam
function formatPrice(price) {
  const number = Number(price);

  if (!Number.isFinite(number)) {
    return price ?? "Chưa có giá";
  }

  return number.toLocaleString("vi-VN") + " ₫";
}

// Tải và hiển thị sản phẩm
async function loadProducts() {
  productMessage.textContent = "Đang tải sản phẩm...";
  productList.innerHTML = "";

  try {
    const response = await fetch(PRODUCT_API);

    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu từ MockAPI.");
    }

    const products = await response.json();

    if (!Array.isArray(products) || products.length === 0) {
      productMessage.textContent =
        "MockAPI hiện không có sản phẩm nào.";
      return;
    }

    productMessage.textContent =
      "Tìm thấy " + products.length + " sản phẩm.";

    products.forEach(function (product) {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = product.id ?? "";

      const imageCell = document.createElement("td");
      const image = document.createElement("img");

      image.src = product.image || "";
      image.alt = product.name || "Sản phẩm";
      image.style.width = "65px";
      image.style.height = "65px";
      image.style.objectFit = "contain";

      image.onerror = function () {
        image.style.display = "none";
        imageCell.textContent = "Không có ảnh";
      };

      imageCell.appendChild(image);

      const nameCell = document.createElement("td");
      nameCell.textContent =
        product.name || product.title || "Chưa có tên";

      const priceCell = document.createElement("td");
      priceCell.textContent = formatPrice(product.price);

      const actionCell = document.createElement("td");
      actionCell.textContent = "Chưa bật sửa/xóa";

      row.append(
        idCell,
        imageCell,
        nameCell,
        priceCell,
        actionCell
      );

      productList.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);

    productMessage.textContent =
      "Không tải được sản phẩm. Hãy kiểm tra API và Console.";
  }
}

// Chỉ tải dữ liệu sau khi admin-common.js xác nhận quyền Admin
window.addEventListener("admin-ready", function () {
  if (adminAllowed) {
    loadProducts();
  }
});

// Nếu trang đã sẵn sàng trước khi sự kiện được phát
if (window.adminPageReady && adminAllowed) {
  loadProducts();
}
