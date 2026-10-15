/**
 * DualTypewriterManager
 * Powers the rotating hero accent word (creative, AI, Cloud, etc.)
 * and cycling sidebar identity names with precise timing.
 */

export class DualTypewriterManager {
  constructor(options = {}) {
    this.heroWords = options.heroWords || window.PORTFOLIO_CONFIG?.hero?.rotatingAccents || [
      { word: "creative", fontClass: "accent-font-creative" },
      { word: "AI", fontClass: "accent-font-ai" },
      { word: "Cloud", fontClass: "accent-font-cloud" },
      { word: "Full-stack", fontClass: "accent-font-fullstack" },
      { word: "Automations", fontClass: "accent-font-automations" }
    ];

    this.identityNames = options.identityNames || window.PORTFOLIO_CONFIG?.identity?.names || ["Aditya Sah"];

    this.heroAccentEl = options.heroAccentEl || document.querySelector(".hero-accent");
    this.heroWordEl = options.heroWordEl || document.querySelector(".hero-accent-text");
    this.identityTextEl = options.identityTextEl || document.querySelector(".identity-name-text");
    this.identityCursorEl = options.identityCursorEl || document.querySelector(".identity-cursor");

    this.accentTimer = null;
    this.identityTimer = null;

    this.init();
  }

  init() {
    this.startAccentTypewriter();
    this.startIdentityTypewriter();
  }

  startAccentTypewriter() {
    if (!this.heroWordEl || this.heroWords.length <= 1) return;

    let currentIndex = 0;
    let charIndex = this.heroWords[0].word.length;
    let state = "hold"; // "hold", "deleting", "typing"

    const tick = () => {
      const currentItem = this.heroWords[currentIndex];
      const targetWord = currentItem.word;

      if (state === "hold") {
        this.accentTimer = window.setTimeout(() => {
          state = "deleting";
          tick();
        }, 1700);
      } else if (state === "deleting") {
        if (charIndex <= 0) {
          currentIndex = (currentIndex + 1) % this.heroWords.length;
          const nextItem = this.heroWords[currentIndex];

          // Swap typography class
          if (this.heroAccentEl) {
            this.heroWords.forEach((a) => this.heroAccentEl.classList.remove(a.fontClass));
            this.heroAccentEl.classList.add(nextItem.fontClass);
          }

          state = "typing";
          this.accentTimer = window.setTimeout(tick, 0);
        } else {
          charIndex--;
          this.heroWordEl.textContent = targetWord.slice(0, charIndex);
          this.accentTimer = window.setTimeout(tick, 50);
        }
      } else if (state === "typing") {
        if (charIndex >= targetWord.length) {
          state = "hold";
          this.accentTimer = window.setTimeout(tick, 0);
        } else {
          charIndex++;
          this.heroWordEl.textContent = targetWord.slice(0, charIndex);
          this.accentTimer = window.setTimeout(tick, 85);
        }
      }
    };

    tick();
  }

  startIdentityTypewriter() {
    if (!this.identityTextEl) return;

    if (this.identityNames.length <= 1) {
      this.identityTextEl.textContent = this.identityNames[0] || "";
      if (this.identityCursorEl) this.identityCursorEl.remove();
      return;
    }

    let currentIndex = 0;
    let charIndex = this.identityNames[0].length;
    let state = "hold";

    const tick = () => {
      const targetName = this.identityNames[currentIndex] || "";

      if (state === "hold") {
        this.identityTimer = window.setTimeout(() => {
          state = "deleting";
          tick();
        }, 1600);
      } else if (state === "deleting") {
        if (charIndex <= 0) {
          currentIndex = (currentIndex + 1) % this.identityNames.length;
          state = "typing";
          this.identityTimer = window.setTimeout(tick, 0);
        } else {
          charIndex--;
          this.identityTextEl.textContent = targetName.slice(0, charIndex);
          this.identityTimer = window.setTimeout(tick, 55);
        }
      } else if (state === "typing") {
        if (charIndex >= targetName.length) {
          state = "hold";
          this.identityTimer = window.setTimeout(tick, 0);
        } else {
          charIndex++;
          this.identityTextEl.textContent = targetName.slice(0, charIndex);
          this.identityTimer = window.setTimeout(tick, 90);
        }
      }
    };

    tick();
  }

  destroy() {
    if (this.accentTimer) window.clearTimeout(this.accentTimer);
    if (this.identityTimer) window.clearTimeout(this.identityTimer);
  }
}
