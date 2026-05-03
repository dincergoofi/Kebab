import { SUPPORTED_LANGUAGES } from "../config/appConfig.js";

export default function AppHeader({
  restaurant,
  tableCode,
  language,
  copy,
  isDemo,
  theme,
  onOpenMenu,
  onLanguageChange,
  onThemeToggle
}) {
  return (
    <header className="topbar app-topbar">
      <button type="button" className="app-menu-button" onClick={onOpenMenu} aria-label={copy.menuDrawer}>
        <span />
        <span />
        <span />
      </button>

      <a className="brand" href="#menu" aria-label={restaurant.name}>
        <span className="brand-mark">
          {restaurant.logo_image_url ? <img src={restaurant.logo_image_url} alt="" /> : <span>RK</span>}
        </span>
        <span>
          <strong>{restaurant.name}</strong>
          <small>
            {restaurant.city} / {copy.table} {tableCode.replace("masa-", "")}
          </small>
        </span>
      </a>

      <div className="topbar-actions">
        {isDemo ? <span className="source-pill" title={copy.demoMode}>Demo</span> : null}
        <a className="header-order-link" href="#delivery">
          {copy.navOrder}
        </a>
        <select
          className="language-select"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          aria-label="Language"
        >
          {SUPPORTED_LANGUAGES.map((item) => (
            <option key={item} value={item}>
              {item.toUpperCase()}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="theme-toggle"
          data-theme-label={theme === "dark" ? copy.lightMode : copy.darkMode}
          onClick={onThemeToggle}
          aria-label={copy.themeToggle}
        >
          <span>{theme === "dark" ? copy.lightMode : copy.darkMode}</span>
        </button>
      </div>
    </header>
  );
}
