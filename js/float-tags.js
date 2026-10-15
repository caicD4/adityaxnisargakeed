/**
 * FloatTagsManager
 * Spawns interactive floating badge tags around the bio keywords
 * on hover or keyboard focus, exactly like the original site.
 */

export class FloatTagsManager {
  constructor(options = {}) {
    this.shellEl = options.shellEl || document.querySelector('.intro-bio-shell');
    this.bioEl = options.bioEl || document.querySelector('.intro-bio');
    this.layerEl = options.layerEl || document.querySelector('.bio-float-layer');
    this.pageStageEl = options.pageStageEl || document.querySelector('.page-stage');
    this.interactiveWords = options.interactiveWords || window.PORTFOLIO_CONFIG?.hero?.bio?.interactiveWords || [];

    this.activeTags = [];
    this.init();
  }

  init() {
    if (!this.bioEl) return;

    if (!this.layerEl && this.shellEl) {
      this.layerEl = document.createElement('div');
      this.layerEl.className = 'bio-float-layer';
      this.layerEl.setAttribute('aria-hidden', 'true');
      this.shellEl.appendChild(this.layerEl);
    }

    // Attach listeners to all .bio-kw elements
    const kwElements = this.bioEl.querySelectorAll('.bio-kw');
    kwElements.forEach(kw => {
      const tone = kw.dataset.tone || Array.from(kw.classList)
        .find(c => c.startsWith('bio-kw--'))
        ?.replace('bio-kw--', '');

      let related = [];
      if (Array.isArray(this.interactiveWords)) {
        const item = this.interactiveWords.find(w => w.tone === tone || w.word === tone);
        related = item?.related || [];
      } else if (this.interactiveWords && typeof this.interactiveWords === 'object') {
        related = this.interactiveWords[tone]?.related || this.interactiveWords[tone] || [];
      }

      const handleOpen = () => this.showTags(related);
      const handleClose = () => this.clearTags();

      kw.addEventListener('mouseenter', handleOpen);
      kw.addEventListener('mouseleave', handleClose);
      kw.addEventListener('focus', handleOpen);
      kw.addEventListener('blur', handleClose);
    });

    // Dismiss tags on scroll or resize
    const handleDismiss = () => {
      if (this.activeTags.length > 0) {
        this.clearTags();
      }
    };

    if (this.pageStageEl) {
      this.pageStageEl.addEventListener('scroll', handleDismiss, { passive: true });
    }
    window.addEventListener('resize', handleDismiss, { passive: true });
  }

  showTags(relatedList) {
    if (!relatedList || relatedList.length === 0 || !this.bioEl || !this.layerEl) return;

    const bioRect = this.bioEl.getBoundingClientRect();
    const shuffled = [...relatedList].sort(() => Math.random() - 0.5);
    const count = Math.min(shuffled.length, 3 + (Math.random() > 0.45 ? 1 : 0));
    const sides = ['top', 'right', 'bottom', 'left'].sort(() => Math.random() - 0.5);

    this.layerEl.innerHTML = '';
    this.activeTags = [];

    const selectedWords = shuffled.slice(0, count);
    selectedWords.forEach((label, idx) => {
      const side = sides[idx % sides.length];
      const offset = 26 + 38 * Math.random();
      const pct = 0.12 + 0.76 * Math.random();
      let x = 0;
      let y = 0;

      switch (side) {
        case 'top':
          x = bioRect.left + bioRect.width * pct;
          y = bioRect.top - offset;
          break;
        case 'bottom':
          x = bioRect.left + bioRect.width * pct;
          y = bioRect.bottom + offset;
          break;
        case 'left':
          x = bioRect.left - offset - 16;
          y = bioRect.top + bioRect.height * pct;
          break;
        case 'right':
          x = bioRect.right + offset + 16;
          y = bioRect.top + bioRect.height * pct;
          break;
      }

      // Clamp within viewport
      x = Math.min(window.innerWidth - 24, Math.max(24, x));
      y = Math.min(window.innerHeight - 24, Math.max(24, y));

      const rot = (Math.random() - 0.5) * 20;
      const delay = 35 * idx + 50 * Math.random();

      const span = document.createElement('span');
      span.className = 'bio-float-word';
      span.textContent = label;
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.setProperty('--float-rot', `${rot}deg`);
      span.style.animationDelay = `${delay}ms`;

      this.layerEl.appendChild(span);
      this.activeTags.push(span);
    });
  }

  clearTags() {
    if (this.layerEl) {
      this.layerEl.innerHTML = '';
    }
    this.activeTags = [];
  }
}
