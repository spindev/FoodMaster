const STORAGE_KEY = "foodmaster-items";
const LANGUAGE_KEY = "foodmaster-language";
const THEME_KEY = "foodmaster-theme";

const ICONS = {
  fridge: "🧊",
  pantry: "🥫",
  freezer: "❄️",
};

const TRANSLATIONS = {
  en: {
    language: "Language",
    appTitle: "FoodMaster",
    addItem: "Add food item",
    name: "Name",
    quantity: "Quantity",
    category: "Category",
    addedAt: "Added on",
    bestBefore: "Best before",
    save: "Save item",
    listTitle: "Stored food",
    noItems: "No items yet.",
    themeDark: "🌙 Dark",
    themeLight: "☀️ Light",
    fridge: "Fridge",
    pantry: "Pantry",
    freezer: "Freezer",
  },
  de: {
    language: "Sprache",
    appTitle: "FoodMaster",
    addItem: "Lebensmittel hinzufügen",
    name: "Name",
    quantity: "Menge",
    category: "Kategorie",
    addedAt: "Hinzugefügt am",
    bestBefore: "Mindestens haltbar bis",
    save: "Eintrag speichern",
    listTitle: "Gelagerte Lebensmittel",
    noItems: "Noch keine Einträge.",
    themeDark: "🌙 Dunkel",
    themeLight: "☀️ Hell",
    fridge: "Kühlschrank",
    pantry: "Vorrat",
    freezer: "Gefrierfach",
  },
};

const itemForm = document.querySelector("#item-form");
const tableBody = document.querySelector("#items-table-body");
const languageSelect = document.querySelector("#language");
const themeToggle = document.querySelector("#theme-toggle");
const addedAtInput = document.querySelector("#addedAt");

let items = loadItems();
let currentLanguage = detectLanguage();
let currentTheme = detectTheme();

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function detectLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved && TRANSLATIONS[saved]) return saved;
  const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  return browserLanguage.toLowerCase().startsWith("de") ? "de" : "en";
}

function detectTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  currentTheme = theme;
  localStorage.setItem(THEME_KEY, theme);
  const t = TRANSLATIONS[currentLanguage];
  themeToggle.textContent = theme === "dark" ? t.themeLight : t.themeDark;
}

function nowForDateTimeLocal() {
  const date = new Date();
  const tzOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

function resetAddedAt() {
  addedAtInput.value = nowForDateTimeLocal();
}

function localize() {
  const t = TRANSLATIONS[currentLanguage];
  document.documentElement.lang = currentLanguage;
  languageSelect.value = currentLanguage;

  const set = (id, value) => {
    document.querySelector(id).textContent = value;
  };
  set("#language-label", t.language);
  set("#app-title", t.appTitle);
  set("#form-title", t.addItem);
  set("#name-label", t.name);
  set("#quantity-label", t.quantity);
  set("#category-label", t.category);
  set("#added-label", t.addedAt);
  set("#best-before-label", t.bestBefore);
  set("#submit-button", t.save);
  set("#list-title", t.listTitle);
  set("#th-category", t.category);
  set("#th-name", t.name);
  set("#th-quantity", t.quantity);
  set("#th-added", t.addedAt);
  set("#th-best-before", t.bestBefore);

  const categorySelect = document.querySelector("#category");
  categorySelect.options[0].text = `${ICONS.fridge} ${t.fridge}`;
  categorySelect.options[1].text = `${ICONS.pantry} ${t.pantry}`;
  categorySelect.options[2].text = `${ICONS.freezer} ${t.freezer}`;

  applyTheme(currentTheme);
  renderItems();
}

function renderItems() {
  tableBody.textContent = "";
  const t = TRANSLATIONS[currentLanguage];

  if (!items.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty";
    cell.textContent = t.noItems;
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  for (const item of items) {
    const row = document.createElement("tr");
    const cells = [
      `${ICONS[item.category] || "📦"} ${t[item.category] || item.category}`,
      item.name,
      item.quantity,
      new Date(item.addedAt).toLocaleString(currentLanguage),
      new Date(item.bestBefore).toLocaleDateString(currentLanguage),
    ];
    for (const value of cells) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }
}

itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(itemForm);
  const newItem = {
    name: (formData.get("name") || "").toString().trim(),
    quantity: (formData.get("quantity") || "").toString().trim(),
    category: (formData.get("category") || "").toString(),
    addedAt: (formData.get("addedAt") || "").toString(),
    bestBefore: (formData.get("bestBefore") || "").toString(),
  };

  if (!newItem.name || !newItem.quantity || !newItem.bestBefore) return;
  if (!Object.prototype.hasOwnProperty.call(ICONS, newItem.category)) return;

  items = [newItem, ...items];
  saveItems();
  itemForm.reset();
  resetAddedAt();
  renderItems();
});

languageSelect.addEventListener("change", () => {
  if (!TRANSLATIONS[languageSelect.value]) return;
  currentLanguage = languageSelect.value;
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  localize();
});

themeToggle.addEventListener("click", () => {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

resetAddedAt();
localize();
renderItems();
