/**
 * ContactManager
 * Renders contact links, handles clipboard copy with feedback animation,
 * and manages accessibility attributes.
 */

export class ContactManager {
  constructor(options = {}) {
    this.container = options.container || document.querySelector('.section-contact') || document.querySelector('#contact .section');
    this.contactConfig = options.contactConfig || window.PORTFOLIO_CONFIG?.contact || {};
    this.links = this.contactConfig.links || [];
    this.copyTimeout = null;

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const list = document.createElement('ul');
    list.className = 'list-rows';
    list.setAttribute('role', 'list');

    this.links.forEach(item => {
      const row = document.createElement('li');
      row.className = 'list-row';

      if (item.copyOnClick) {
        row.appendChild(this.buildCopyEmailElement(item));
      } else {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'link-row';
        link.target = item.href.startsWith('mailto:') ? '_self' : '_blank';
        link.rel = 'noreferrer noopener';
        link.textContent = item.label;
        row.appendChild(link);
      }

      list.appendChild(row);
    });

    this.container.appendChild(list);
  }

  buildCopyEmailElement(item) {
    const wrap = document.createElement('span');
    wrap.className = 'contact-email-wrap';

    const copyTag = document.createElement('span');
    copyTag.className = 'contact-copy-tag';
    copyTag.setAttribute('aria-hidden', 'true');
    copyTag.textContent = 'click here to copy';

    const emailValue = item.copyValue || this.contactConfig.email || item.href.replace(/^mailto:/, '');

    const link = document.createElement('a');
    link.href = item.href || `mailto:${emailValue}`;
    link.className = 'link-row contact-email-link';
    link.title = `${emailValue} — click to copy`;
    link.setAttribute('aria-label', `Email. Click to copy ${emailValue} to clipboard.`);
    link.textContent = item.label || 'Email';

    const srLive = document.createElement('span');
    srLive.className = 'sr-only';
    srLive.setAttribute('aria-live', 'polite');

    link.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await this.copyToClipboard(emailValue);
      } catch (_) {}

      wrap.classList.add('is-copied');
      copyTag.setAttribute('aria-hidden', 'false');
      copyTag.textContent = 'Copied!';
      srLive.textContent = `${emailValue} copied to clipboard`;

      if (this.copyTimeout) {
        window.clearTimeout(this.copyTimeout);
      }

      this.copyTimeout = window.setTimeout(() => {
        wrap.classList.remove('is-copied');
        copyTag.setAttribute('aria-hidden', 'true');
        copyTag.textContent = 'click here to copy';
        srLive.textContent = '';
        this.copyTimeout = null;
      }, 1600);
    });

    wrap.appendChild(copyTag);
    wrap.appendChild(link);
    wrap.appendChild(srLive);

    return wrap;
  }

  async copyToClipboard(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {
      // Fallback below
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (_) {
      return false;
    }
  }
}
