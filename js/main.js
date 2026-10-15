/**
 * Main Application Orchestrator
 * Bootstraps all modular systems and synchronizes section transitions.
 */

import { ThemeManager } from './theme.js';
import { NavigationManager } from './navigation.js';
import { DualTypewriterManager } from './typewriter.js';
import { FloatTagsManager } from './float-tags.js';
import { ProjectsManager } from './projects.js';
import { ContactManager } from './contact.js';
import { ClockManager } from './clock.js';
import { AsciiCanvasEngine } from './ascii-canvas.js';

document.addEventListener('DOMContentLoaded', () => {
  const config = window.PORTFOLIO_CONFIG;
  if (!config) {
    console.error('PORTFOLIO_CONFIG is not defined! Please ensure config.js is loaded first.');
    return;
  }

  // 1. Theme Manager
  const themeManager = new ThemeManager();

  // 2. Navigation Manager
  let asciiEngine = null;

  const navManager = new NavigationManager({
    onSectionChange: (sectionId) => {
      const isBlog = sectionId === 'blog';
      const mainEl = document.querySelector('main.portfolio-page');
      const blogFullscreenEl = document.querySelector('.blog-ascii-fullscreen');

      if (mainEl) {
        mainEl.classList.toggle('is-blog-view', isBlog);
      }
      if (blogFullscreenEl) {
        blogFullscreenEl.classList.toggle('is-active', isBlog);
        blogFullscreenEl.setAttribute('aria-hidden', (!isBlog).toString());
      }

      if (asciiEngine) {
        asciiEngine.setActive(isBlog);
      }
    }
  });

  // 3. Dual Typewriter Manager
  const typewriterManager = new DualTypewriterManager({
    heroWordEl: document.querySelector('.hero-accent-text'),
    heroAccentEl: document.querySelector('.hero-accent'),
    heroWords: config.hero?.rotatingAccents || config.hero?.rotatingWords,
    identityTextEl: document.querySelector('.identity-name-text'),
    identityCursorEl: document.querySelector('.identity-cursor'),
    identityNames: config.identity?.names || config.identity?.rotatingNames || [config.identity?.name]
  });

  // 4. Bio Floating Badges Manager
  const floatTagsManager = new FloatTagsManager({
    interactiveWords: config.hero?.bio?.interactiveWords
  });

  // 5. Projects Accordion Manager
  const projectsManager = new ProjectsManager({
    projects: config.projects
  });

  // 6. Contact & Email Copy Manager
  const contactManager = new ContactManager({
    contactConfig: config.contact
  });

  // 7. Timezone Clock Manager
  const clockManager = new ClockManager({
    timeZone: config.footer?.timeZone || config.identity?.timezone || 'Asia/Kolkata',
    locale: config.footer?.locale || config.identity?.locale || 'en-IN'
  });

  // 8. ASCII Canvas Engine
  const currentSection = navManager.getCurrentSection();
  const isInitialBlog = currentSection === 'blog';

  asciiEngine = new AsciiCanvasEngine({
    canvas: document.querySelector('.blog-ascii-canvas'),
    config: config.blog,
    src: config.blog?.asciiMedia || config.blog?.gifSrc || 'assets/blog/coming-soon.gif',
    active: isInitialBlog
  });
  window.asciiEngine = asciiEngine;

  // Initial state synchronization
  const mainEl = document.querySelector('main.portfolio-page');
  const blogFullscreenEl = document.querySelector('.blog-ascii-fullscreen');
  if (mainEl) {
    mainEl.classList.toggle('is-blog-view', isInitialBlog);
  }
  if (blogFullscreenEl) {
    blogFullscreenEl.classList.toggle('is-active', isInitialBlog);
    blogFullscreenEl.setAttribute('aria-hidden', (!isInitialBlog).toString());
  }

  // Populate dynamic intro text and focus lists from config
  const currentlyListEl = document.querySelector('.intro-currently-list');
  const focusItems = config.hero?.currently || config.hero?.currentlyFocus;
  if (currentlyListEl && Array.isArray(focusItems)) {
    currentlyListEl.innerHTML = '';
    focusItems.forEach(item => {
      const li = document.createElement('li');
      const star = document.createElement('span');
      star.className = 'intro-currently-star';
      star.setAttribute('aria-hidden', 'true');
      star.textContent = '∗';
      li.appendChild(star);
      li.appendChild(document.createTextNode(item));
      currentlyListEl.appendChild(li);
    });
  }

  // Populate footer brand and credits from config
  const footerMark = document.querySelector('.site-footer-mark');
  const authorName = config.identity?.names?.[0] || config.identity?.name || 'Aditya Sah';
  if (footerMark) {
    footerMark.textContent = authorName;
  }

  const footerMade = document.querySelector('.site-footer-made');
  const studioName = config.footer?.studio || config.identity?.madeWith || 'zer01 studio';
  if (footerMade) {
    footerMade.innerHTML = `made with <span class="heart-blob" aria-label="love" role="img"><span class="heart-blob-core" aria-hidden="true"></span></span> at ${studioName}`;
  }

  const footerYear = document.querySelector('.site-footer-year');
  if (footerYear) {
    footerYear.textContent = `© ${new Date().getFullYear()}`;
  }
});
