document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
  loadProducts();
  renderCart();

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  const burger = document.querySelector(".burger");
  const mobile = document.getElementById("mobile-menu");
  burger?.addEventListener("click", () => mobile?.classList.toggle("open"));
  mobile?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobile.classList.remove("open"));
  });

  document.getElementById("cart-toggle")?.addEventListener("click", openCart);
  document.getElementById("cart-close")?.addEventListener("click", closeCart);
  document.getElementById("cart-overlay")?.addEventListener("click", closeCart);
  document.getElementById("checkout-wa")?.addEventListener("click", checkoutWhatsApp);

  document.getElementById("category-filter")?.addEventListener("change", (e) => {
    filterCat = e.target.value;
    renderProducts();
  });

  const runSearch = () => {
    searchQ = document.getElementById("search-input")?.value.trim() || "";
    renderProducts();
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };
  document.getElementById("search-btn")?.addEventListener("click", runSearch);
  document.getElementById("search-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
});
