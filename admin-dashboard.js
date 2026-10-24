const API_URL = "https://6a115dca3e35d0f37ee33025.mockapi.io/vs/pp";
checkAdminAccess().then(async ok => {
  if (!ok) return;
  const putCount = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Không tải được sản phẩm");
    const products = await response.json();
    putCount("productCount", products.length);
  } catch (e) { console.error(e); putCount("productCount", "—"); }
  try {
    const [orders, customers] = await Promise.all([
      adminDb.collection("orders").get(),
      adminDb.collection("users").get()
    ]);
    putCount("orderCount", orders.size);
    putCount("customerCount", customers.size);
  } catch (e) {
    console.error(e); putCount("orderCount", "—"); putCount("customerCount", "—");
  }
});
