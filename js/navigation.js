/**
 * NavigationManager
 * Controls section switching, smooth scrolling, Vim shortcuts (h, j, k, l),
 * mouse spotlight tracking (--nav-mx, --nav-my), and scroll spy.
 */

export class NavigationManager {
  constructor(options = {}) {
    this.sections = options.sections || window.PORTFOLIO_CONFIG?.sections || [
      { id: "about", label: "about", shortcut: "h" },
      { id: "projects", label: "projects", shortcut: "j" },
      { id: "blog", label: "blog", shortcut: "k" },
      { id: "contact", label: "contact", shortcut: "l" }
    ];

    this.onSectionChange = options.onSectionChange || null;
    this.activeSectionId = this.sections[0].id;
    this.navContainer = options.navContainer || document.querySelector(".section-nav");
    this.pageStage = options.pageStage || document.querySelector(".page-stage");

    this.init();
  }

  init() {
    this.setupLinks();
    this.setupSpotlight();
    this.setupScrollSpy();
    this.setupHashChange();
    this.setupKeyboardShortcuts();

    // Check initial hash or default to first section
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && this.sections.some((s) => s.id === initialHash)) {
      this.setActiveSection(initialHash, false);
    } else {
      this.setActiveSection(this.sections[0].id, false);
    }

    window.NavigationManager = this;
  }

  getCurrentSection() {
    return this.activeSectionId;
  }

  setActiveSection(id, shouldScroll = true) {
    if (!this.sections.some((s) => s.id === id)) return;
    this.activeSectionId = id;

    // Update nav links
    document.querySelectorAll(".section-nav-link").forEach((link) => {
      const match = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", match);
      if (match) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Update section screens
    document.querySelectorAll(".page-screen").forEach((screen) => {
      const isActive = screen.id === id;
      screen.classList.toggle("is-active", isActive);
      screen.classList.toggle("is-inactive", !isActive);
    });

    // Handle blog view classes
    const isBlog = id === "blog";
    const mainPage = document.querySelector(".portfolio-page");
    if (mainPage) {
      mainPage.classList.toggle("is-blog-view", isBlog);
    }
    const asciiBg = document.querySelector(".blog-ascii-fullscreen");
    if (asciiBg) {
      asciiBg.classList.toggle("is-active", isBlog);
      asciiBg.setAttribute("aria-hidden", isBlog ? "false" : "true");
    }

    if (typeof this.onSectionChange === "function") {
      this.onSectionChange(id);
    }

    window.dispatchEvent(new CustomEvent("portfolio-section-change", { detail: { sectionId: id, isBlog } }));

    // Scroll into view if requested
    if (shouldScroll) {
      const targetEl = document.getElementById(id);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
      if (window.location.hash !== `#${id}`) {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  }

  setupLinks() {
    if (!this.navContainer) return;
    this.navContainer.querySelectorAll(".section-nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").replace("#", "");
        this.setActiveSection(targetId, true);
      });
    });
  }

  setupSpotlight() {
    if (!this.navContainer) return;

    const handleMouseMove = (e) => {
      const rect = this.navContainer.getBoundingClientRect();
      this.navContainer.style.setProperty("--nav-mx", `${e.clientX - rect.left}px`);
      this.navContainer.style.setProperty("--nav-my", `${e.clientY - rect.top}px`);
      this.navContainer.classList.add("is-dot-hover");
    };

    this.navContainer.addEventListener("mousemove", handleMouseMove);
    this.navContainer.addEventListener("mouseenter", handleMouseMove);
    this.navContainer.addEventListener("mouseleave", () => {
      this.navContainer.classList.remove("is-dot-hover");
    });
  }

  setupScrollSpy() {
    const sectionEls = Array.from(document.querySelectorAll("[data-page-section]"));
    if (sectionEls.length === 0 || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topEntry = visibleEntries[0];
          if (topEntry && topEntry.target.id !== this.activeSectionId) {
            this.setActiveSection(topEntry.target.id, false);
          }
        }
      },
      {
        root: window.innerWidth < 1024 ? null : this.pageStage,
        threshold: [0.35, 0.5, 0.65, 0.8]
      }
    );

    sectionEls.forEach((el) => observer.observe(el));
  }

  setupHashChange() {
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && this.sections.some((s) => s.id === hash)) {
        this.setActiveSection(hash, true);
      }
    });
  }

  setupKeyboardShortcuts() {
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

      const key = e.key.toLowerCase();
      const matched = this.sections.find((s) => s.shortcut === key);
      if (matched) {
        e.preventDefault();
        this.setActiveSection(matched.id, true);
      }
    });
  }
}
