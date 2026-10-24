const customerList = document.getElementById("customerList");
checkAdminAccess().then(async ok=>{
  if(!ok)return;
  try{
    const snap=await adminDb.collection("users").get();
    if(snap.empty){customerList.innerHTML='<div class="empty">Chưa có hồ sơ trong collection users.</div>';return;}
    snap.forEach(doc=>{
      const d=doc.data(), row=document.createElement("div");row.className="customer-row";
      const title=document.createElement("strong");title.textContent=d.username||d.displayName||"Người dùng";
      const email=document.createElement("p");email.textContent="Email: "+(d.email||"Chưa có");
      const uid=document.createElement("small");uid.textContent="UID: "+doc.id;
      row.append(title,email,uid);customerList.append(row);
    });
  }catch(e){console.error(e);customerList.textContent="Không đọc được users. Kiểm tra Firestore Rules.";}
});
