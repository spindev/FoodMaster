import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'foodmaster-items'
const LANGUAGE_KEY = 'foodmaster-language'
const THEME_KEY = 'foodmaster-theme'

const ICONS = {
  fridge: '🧊',
  pantry: '🥫',
  freezer: '❄️',
}

const TRANSLATIONS = {
  en: {
    language: 'Language',
    appTitle: 'FoodMaster',
    addItem: 'Add food item',
    name: 'Name',
    quantity: 'Quantity',
    category: 'Category',
    addedAt: 'Added on',
    bestBefore: 'Best before',
    save: 'Save item',
    listTitle: 'Stored food',
    noItems: 'No items yet.',
    themeDark: '🌙 Dark',
    themeLight: '☀️ Light',
    fridge: 'Fridge',
    pantry: 'Pantry',
    freezer: 'Freezer',
  },
  de: {
    language: 'Sprache',
    appTitle: 'FoodMaster',
    addItem: 'Lebensmittel hinzufügen',
    name: 'Name',
    quantity: 'Menge',
    category: 'Kategorie',
    addedAt: 'Hinzugefügt am',
    bestBefore: 'Mindestens haltbar bis',
    save: 'Eintrag speichern',
    listTitle: 'Gelagerte Lebensmittel',
    noItems: 'Noch keine Einträge.',
    themeDark: '🌙 Dunkel',
    themeLight: '☀️ Hell',
    fridge: 'Kühlschrank',
    pantry: 'Vorrat',
    freezer: 'Gefrierfach',
  },
}

function detectLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY)
  if (saved && TRANSLATIONS[saved]) return saved
  const browserLanguage = navigator.languages?.[0] || navigator.language || 'en'
  return browserLanguage.toLowerCase().startsWith('de') ? 'de' : 'en'
}

function detectTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function nowForDateTimeLocal() {
  const date = new Date()
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16)
}

function parseItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function App() {
  const [language, setLanguage] = useState(() => detectLanguage())
  const [theme, setTheme] = useState(() => detectTheme())
  const [items, setItems] = useState(() => parseItems())
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    category: 'fridge',
    addedAt: nowForDateTimeLocal(),
    bestBefore: '',
  })

  const t = useMemo(() => TRANSLATIONS[language], [language])

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!Object.prototype.hasOwnProperty.call(ICONS, form.category)) {
      console.warn('Invalid category value submitted:', form.category)
      return
    }
    if (!form.name.trim() || !form.quantity.trim() || !form.bestBefore) return

    setItems((prev) => [{ ...form, name: form.name.trim(), quantity: form.quantity.trim() }, ...prev])
    setForm((prev) => ({
      ...prev,
      name: '',
      quantity: '',
      category: 'fridge',
      addedAt: nowForDateTimeLocal(),
      bestBefore: '',
    }))
  }

  return (
    <>
      <header className="app-header">
        <h1>{t.appTitle}</h1>
        <div className="header-controls">
          <label htmlFor="language">{t.language}</label>
          <select id="language" value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          <button type="button" onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}>
            {theme === 'dark' ? t.themeLight : t.themeDark}
          </button>
        </div>
      </header>

      <main>
        <section className="card">
          <h2>{t.addItem}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <label>
                <span>{t.name}</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  maxLength={120}
                />
              </label>
              <label>
                <span>{t.quantity}</span>
                <input
                  value={form.quantity}
                  onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  required
                  maxLength={40}
                />
              </label>
              <label>
                <span>{t.category}</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  required
                >
                  <option value="fridge">{`${ICONS.fridge} ${t.fridge}`}</option>
                  <option value="pantry">{`${ICONS.pantry} ${t.pantry}`}</option>
                  <option value="freezer">{`${ICONS.freezer} ${t.freezer}`}</option>
                </select>
              </label>
              <label>
                <span>{t.addedAt}</span>
                <input value={form.addedAt} type="datetime-local" readOnly />
              </label>
              <label>
                <span>{t.bestBefore}</span>
                <input
                  value={form.bestBefore}
                  onChange={(event) => setForm((prev) => ({ ...prev, bestBefore: event.target.value }))}
                  type="date"
                  required
                />
              </label>
            </div>
            <button id="submit-button" type="submit">
              {t.save}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>{t.listTitle}</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t.category}</th>
                  <th>{t.name}</th>
                  <th>{t.quantity}</th>
                  <th>{t.addedAt}</th>
                  <th>{t.bestBefore}</th>
                </tr>
              </thead>
              <tbody>
                {!items.length ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      {t.noItems}
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={`${item.name}-${item.addedAt}-${index}`}>
                      <td>{`${ICONS[item.category] || '📦'} ${t[item.category] || item.category}`}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{new Date(item.addedAt).toLocaleString(language)}</td>
                      <td>{new Date(item.bestBefore).toLocaleDateString(language)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  )
}
