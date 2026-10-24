const API_URL = "https://6a115dca3e35d0f37ee33025.mockapi.io/vs/pp";
const $ = id => document.getElementById(id);
const productForm = $("productForm"), productList = $("productList");
const productMessage = $("productMessage"), saveProductBtn = $("saveProductBtn"), cancelEditBtn = $("cancelEditBtn");
let isAdmin = false, editingId = null;
function showMessage(message) { productMessage.textContent = message; }
function formatPrice(price) { return Number(price || 0).toLocaleString("vi-VN") + " đ"; }

async function loadProducts() {
  if (!isAdmin) return;
  productList.textContent = "Đang tải sản phẩm...";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const products = await response.json();
    productList.replaceChildren();
    if (!products.length) {
      productList.innerHTML = '<div class="empty">Chưa có sản phẩm trong MockAPI.</div>';
      return;
    }
    products.forEach(product => {
      const card = document.createElement("article"); card.className = "admin-product";
      const image = document.createElement("img"); image.src = product.image || ""; image.alt = product.name || "Sản phẩm";
      image.onerror = () => { image.removeAttribute("src"); image.alt = "Không tải được ảnh"; };
      const name = document.createElement("input"); name.value = product.name || ""; name.setAttribute("aria-label","Tên sản phẩm");
      const price = document.createElement("input"); price.type = "number"; price.min = "0"; price.step = "1"; price.value = Number(product.price)||0; price.setAttribute("aria-label","Giá sản phẩm");
      const imageUrl = document.createElement("input"); imageUrl.type = "url"; imageUrl.value = product.image || ""; imageUrl.setAttribute("aria-label","Link hình ảnh");
      const idText = document.createElement("div"); idText.className = "product-id"; idText.textContent = "Mã: " + product.id + " | Giá hiện tại: " + formatPrice(product.price);
      const actions = document.createElement("div"); actions.className = "product-actions";
      const saveBtn = document.createElement("button"); saveBtn.type = "button"; saveBtn.textContent = "Lưu sửa đổi";
      saveBtn.addEventListener("click", async () => {
        if (!isAdmin) return;
        const newName=name.value.trim(), newPrice=Number(price.value), newImage=imageUrl.value.trim();
        if (!newName || !newImage || !Number.isFinite(newPrice) || newPrice < 0) { alert("Vui lòng kiểm tra tên, giá và link ảnh."); return; }
        if (!confirm("Xác nhận cập nhật sản phẩm này?")) return;
        saveBtn.disabled=true;
        try {
          const res=await fetch(API_URL+"/"+encodeURIComponent(product.id),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:newName,price:newPrice,image:newImage})});
          if(!res.ok) throw new Error("HTTP "+res.status);
          showMessage("Đã cập nhật sản phẩm "+product.id+"."); await loadProducts();
        } catch(e) { console.error(e); alert("Không cập nhật được sản phẩm."); saveBtn.disabled=false; }
      });
      actions.append(saveBtn);
      card.append(image,name,price,imageUrl,idText,actions); productList.append(card);
    });
  } catch(e) { console.error("Lỗi tải sản phẩm:",e); productList.textContent="Không tải được sản phẩm. Kiểm tra MockAPI và mạng."; }
}
productForm.addEventListener("submit", async event => {
  event.preventDefault(); if (!isAdmin) return;
  const name=$("productName").value.trim(), price=Number($("productPrice").value), image=$("productImage").value.trim();
  if(!name || !image || !Number.isFinite(price) || price<0){showMessage("Vui lòng nhập thông tin hợp lệ.");return;}
  saveProductBtn.disabled=true;
  const wasEditing = editingId !== null;
  try {
    const payload={name,price,image};
    const url=wasEditing ? API_URL+"/"+encodeURIComponent(editingId) : API_URL;
    const res=await fetch(url,{method:wasEditing?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    if(!res.ok) throw new Error("HTTP "+res.status);
    productForm.reset(); editingId=null; saveProductBtn.textContent="Thêm sản phẩm"; cancelEditBtn.hidden=true;
    showMessage(wasEditing ? "Đã cập nhật sản phẩm thành công." : "Đã thêm sản phẩm thành công.");
    await loadProducts();
  } catch(e) { console.error(e); showMessage("Không lưu được sản phẩm. Hãy thử lại."); }
  finally { saveProductBtn.disabled=false; }
});
cancelEditBtn.addEventListener("click",()=>{editingId=null;productForm.reset();saveProductBtn.textContent="Thêm sản phẩm";cancelEditBtn.hidden=true;showMessage("Đã hủy thao tác sửa.");});
checkAdminAccess().then(ok=>{if(ok){isAdmin=true;loadProducts();}});
