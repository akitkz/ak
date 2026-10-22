let PRODUCTS = [];
let cart = JSON.parse(localStorage.getItem("avtokit_cart") || "[]");
let filterCat = "all";
let searchQ = "";

const WHATSAPP = "77054529356"; // public contact only — no API secrets

async function loadProducts() {
  try {
    const res = await fetch("data/products.json");
    PRODUCTS = await res.json();
  } catch (e) {
    PRODUCTS = [];
  }
  renderProducts();
}

function formatPrice(n) {
  return new Intl.NumberFormat("ru-RU").format(n) + " ₸";
}

function productName(p) {
  return lang === "kk" ? p.name_kk : p.name_ru;
}

function filteredProducts() {
  return PRODUCTS.filter((p) => {
    if (filterCat !== "all" && p.category !== filterCat) return false;
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return (
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.name_ru.toLowerCase().includes(q) ||
      p.name_kk.toLowerCase().includes(q) ||
      (p.compatible && p.compatible.toLowerCase().includes(q))
    );
  });
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  const list = filteredProducts();
  if (!list.length) {
    grid.innerHTML = `<p class="search-hint">${lang === "kk" ? "Ештеңе табылмады" : "Ничего не найдено"}</p>`;
    return;
  }
  grid.innerHTML = list
    .map((p) => {
      const stockClass = p.stock === "in" ? "" : "order";
      const stockText = p.stock === "in" ? t("stock_in") : t("stock_order");
      return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-img">${p.brand}</div>
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${productName(p)}</div>
        <div class="product-art">${t("art")} ${p.sku}</div>
        <div class="product-stock ${stockClass}">${stockText}</div>
        <div class="product-price">${formatPrice(p.price)}</div>
        <button type="button" class="btn btn-primary btn-sm add-btn" data-id="${p.id}">${t("add_cart")}</button>
      </article>`;
    })
    .join("");

  grid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const existing = cart.find((x) => x.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id: p.id, sku: p.sku, brand: p.brand, name_ru: p.name_ru, name_kk: p.name_kk, price: p.price, qty: 1 });
  saveCart();
  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter((x) => x.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("avtokit_cart", JSON.stringify(cart));
  const el = document.getElementById("cart-count");
  if (el) el.textContent = String(cart.reduce((s, i) => s + i.qty, 0));
}

function renderCart() {
  saveCart();
  const body = document.getElementById("cart-body");
  const totalEl = document.getElementById("cart-total");
  if (!body) return;
  if (!cart.length) {
    body.innerHTML = `<p class="cart-empty">${t("cart_empty")}</p>`;
    if (totalEl) totalEl.textContent = "0 ₸";
    return;
  }
  let total = 0;
  body.innerHTML = cart
    .map((item) => {
      total += item.price * item.qty;
      const name = lang === "kk" ? item.name_kk : item.name_ru;
      return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${name}</div>
          <div class="cart-item-meta">${item.brand} · ${item.sku} · ×${item.qty}</div>
        </div>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        <button type="button" class="cart-item-remove" data-id="${item.id}" aria-label="Remove">×</button>
      </div>`;
    })
    .join("");
  body.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function openCart() {
  document.getElementById("cart-drawer")?.classList.add("open");
  document.getElementById("cart-overlay")?.classList.add("open");
}

function closeCart() {
  document.getElementById("cart-drawer")?.classList.remove("open");
  document.getElementById("cart-overlay")?.classList.remove("open");
}

function checkoutWhatsApp() {
  if (!cart.length) return;
  const lines = cart.map((i) => {
    const name = lang === "kk" ? i.name_kk : i.name_ru;
    return `• ${i.brand} ${name} (${i.sku}) ×${i.qty} — ${formatPrice(i.price * i.qty)}`;
  });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const msg = t("wa_order")
    .replace("{items}", lines.join("\n"))
    .replace("{total}", new Intl.NumberFormat("ru-RU").format(total));
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
}

window.renderProducts = renderProducts;
window.renderCart = renderCart;
