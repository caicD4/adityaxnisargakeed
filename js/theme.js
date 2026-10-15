/**
 * ThemeManager
 * Handles dark/light theme switching, persistence, system preference detection,
 * and the 't' key shortcut.
 */

export class ThemeManager {
  constructor(options = {}) {
    this.config = options.config || window.PORTFOLIO_CONFIG?.theme || {
      defaultTheme: "dark",
      storageKey: "aditya-theme",
      shortcutKey: "t"
    };

    this.html = document.documentElement;
    this.dotBtn = options.button || document.querySelector(".theme-dot");

    this.init();
  }

  init() {
    this.apply(this.getSavedTheme());

    if (this.dotBtn) {
      this.dotBtn.addEventListener("click", () => this.toggle());
    }

    // Keyboard shortcut 't'
    window.addEventListener("keydown", (e) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return;
      }

      if (e.key.toLowerCase() === (this.config.shortcutKey || "t")) {
        e.preventDefault();
        this.toggle();
      }
    });

    window.ThemeManager = this;
  }

  getSavedTheme() {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (_) {
      return this.config.defaultTheme || "dark";
    }
  }

  apply(theme) {
    this.html.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(this.config.storageKey, theme);
    } catch (_) {}

    if (this.dotBtn) {
      const nextTheme = theme === "dark" ? "light" : "dark";
      this.dotBtn.setAttribute("aria-label", `Switch to ${nextTheme} mode (shortcut ${this.config.shortcutKey})`);
      this.dotBtn.setAttribute("title", `Switch to ${nextTheme} mode (${this.config.shortcutKey})`);
      this.dotBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }

    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: { theme } }));
  }

  toggle() {
    const current = this.html.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";

    const useAnimeTransition =
      this.config.animeTransition !== false &&
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (useAnimeTransition) {
      document.startViewTransition(() => {
        this.apply(next);
      });
    } else {
      this.apply(next);
    }
  }

  getCurrent() {
    return this.html.getAttribute("data-theme") || "dark";
  }
}
