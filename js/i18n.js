const I18N = {
  ru: {
    nav_catalog: "Каталог",
    nav_search: "Поиск",
    nav_oferta: "Оферта",
    nav_privacy: "Конфиденциальность",
    nav_contacts: "Контакты",
    hero_badge: "Демо-витрина · тест",
    hero_title: "Интернет-магазин<br>автозапчастей",
    hero_sub: "Новые запчасти · Подбор по артикулу и VIN · Костанай · Доставка по РК",
    hero_catalog: "Смотреть каталог",
    hero_search: "Поиск по артикулу",
    search_title: "Поиск запчастей",
    search_desc: "Введите артикул или название. В демо — локальный каталог.",
    search_btn: "Найти",
    search_hint: "Позже здесь будет проценка у поставщиков по API (ключи не публикуются).",
    catalog_title: "Каталог",
    cat_all: "Все категории",
    how_title: "Как заказать",
    how_1: "Найдите деталь в каталоге или по артикулу",
    how_2: "Добавьте в корзину",
    how_3: "Отправьте заявку в WhatsApp — подтвердим наличие и цену",
    how_note: "Онлайн-оплата (Kaspi / Halyk) и синхронизация с учётом — на следующем этапе, на отдельном сервере.",
    contacts_title: "Контакты",
    address_label: "Адрес",
    phone_label: "Телефон",
    wa_write: "Написать",
    kaspi_shop: "Магазин на Kaspi",
    footer_demo: "Демо-версия для теста. Не является публичной офертой до публикации финальных документов.",
    cart_title: "Корзина",
    cart_total: "Итого",
    cart_checkout: "Отправить в WhatsApp",
    cart_note: "Заявка уходит в WhatsApp. Оплата на сайте — позже.",
    cart_empty: "Корзина пуста",
    add_cart: "В корзину",
    stock_in: "В наличии",
    stock_order: "Под заказ",
    art: "Арт.",
    wa_order: "Здравствуйте! Заказ с сайта АвтоКит (демо):\n\n{items}\nИтого: {total} ₸\n\nПрошу подтвердить наличие и срок."
  },
  kk: {
    nav_catalog: "Каталог",
    nav_search: "Іздеу",
    nav_oferta: "Оферта",
    nav_privacy: "Құпиялылық",
    nav_contacts: "Байланыс",
    hero_badge: "Демо-витрина · тест",
    hero_title: "Автобөлшектер<br>интернет-дүкені",
    hero_sub: "Жаңа бөлшектер · Артикул және VIN бойынша іріктеу · Қостанай · ҚР бойынша жеткізу",
    hero_catalog: "Каталогты қарау",
    hero_search: "Артикул бойынша іздеу",
    search_title: "Бөлшектерді іздеу",
    search_desc: "Артикул немесе атауын енгізіңіз. Демода — жергілікті каталог.",
    search_btn: "Табу",
    search_hint: "Кейін мұнда жеткізушілер API арқылы процент болады (кілттер жарияланбайды).",
    catalog_title: "Каталог",
    cat_all: "Барлық санаттар",
    how_title: "Қалай тапсырыс беру",
    how_1: "Каталогтан немесе артикул бойынша бөлшекті табыңыз",
    how_2: "Себетке қосыңыз",
    how_3: "WhatsApp-қа өтінім жіберіңіз — бар-жоғын және бағасын растаймыз",
    how_note: "Онлайн төлем (Kaspi / Halyk) және есеппен синхрон — келесі кезеңде, бөлек серверде.",
    contacts_title: "Байланыс",
    address_label: "Мекенжай",
    phone_label: "Телефон",
    wa_write: "Жазу",
    kaspi_shop: "Kaspi дүкені",
    footer_demo: "Тестке арналған демо-нұсқа. Финал құжаттар жарияланғанша оферта емес.",
    cart_title: "Себет",
    cart_total: "Барлығы",
    cart_checkout: "WhatsApp-қа жіберу",
    cart_note: "Өтінім WhatsApp-қа кетеді. Сайтта төлем — кейінірек.",
    cart_empty: "Себет бос",
    add_cart: "Себетке",
    stock_in: "Қолда бар",
    stock_order: "Тапсырыспен",
    art: "Арт.",
    wa_order: "Сәлеметсіз бе! АвтоКит сайтынан тапсырыс (демо):\n\n{items}\nБарлығы: {total} ₸\n\nБар-жоғын және мерзімін растауды сұраймын."
  }
};

let lang = localStorage.getItem("avtokit_shop_lang") || "ru";

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.ru[key] || key;
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val && val.includes("<br>")) el.innerHTML = val;
    else if (val) el.textContent = val;
  });
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  document.documentElement.lang = lang === "kk" ? "kk" : "ru";
}

function setLang(l) {
  lang = l;
  localStorage.setItem("avtokit_shop_lang", l);
  applyI18n();
  if (typeof window.renderProducts === "function") window.renderProducts();
  if (typeof window.renderCart === "function") window.renderCart();
}
