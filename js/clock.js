/**
 * ClockManager
 * Displays a live ticking clock in the footer formatted according
 * to the configured timeZone (default: Asia/Kolkata).
 */

export class ClockManager {
  constructor(options = {}) {
    this.timeEl = options.timeEl || document.querySelector('.site-footer-time');
    this.timeZone = options.timeZone || window.PORTFOLIO_CONFIG?.footer?.timeZone || window.PORTFOLIO_CONFIG?.identity?.timezone || 'Asia/Kolkata';
    this.locale = options.locale || window.PORTFOLIO_CONFIG?.footer?.locale || window.PORTFOLIO_CONFIG?.identity?.locale || 'en-IN';
    this.timer = null;

    this.formatter = new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    this.init();
  }

  init() {
    if (!this.timeEl) return;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (!this.timeEl) return;
    const now = new Date();
    const formatted = this.formatter.format(now);
    this.timeEl.textContent = formatted;
    this.timeEl.setAttribute('aria-label', `Current time ${formatted}`);
  }

  destroy() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}
