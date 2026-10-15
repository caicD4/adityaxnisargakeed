/**
 * ====================================================================
 * PORTFOLIO CONFIGURATION
 * ====================================================================
 * Fully customize your website's content, text, links, projects,
 * animations, and preferences right here!
 */

window.PORTFOLIO_CONFIG = {
  // Identity & Navigation
  identity: {
    // Array of names for the typewriter effect in the sidebar (supports multiple rotating names)
    names: ["Aditya Sah"],
    madeWith: "zer01 studio",
    availableForWork: true,
    workStatusText: "Available for select work",
    // Timezone for the live ticking footer clock
    timezone: "Asia/Kolkata",
    locale: "en-IN"
  },

  // Section Navigation and Vim/Single-Key Shortcuts
  sections: [
    { id: "about", label: "about", shortcut: "h" },
    { id: "projects", label: "projects", shortcut: "j" },
    { id: "blog", label: "blog", shortcut: "k" },
    { id: "contact", label: "contact", shortcut: "l" }
  ],

  // Theme Settings
  theme: {
    defaultTheme: "dark", // "dark" or "light"
    storageKey: "aditya-theme",
    shortcutKey: "t", // Press 't' to toggle theme
    animeTransition: true // Dancing anime girl (Shigure Ui) View Transition on theme toggle
  },

  // About / Hero Section
  hero: {
    titlePrefix: "Independent",
    titleSuffix: "engineer",
    // Rotating accent words in the main title with distinct typography classes
    rotatingAccents: [
      { word: "creative", fontClass: "accent-font-creative" },
      { word: "AI", fontClass: "accent-font-ai" },
      { word: "Cloud", fontClass: "accent-font-cloud" },
      { word: "Full-stack", fontClass: "accent-font-fullstack" },
      { word: "Automations", fontClass: "accent-font-automations" }
    ],
    // Bio paragraph with interactive hover tags
    bio: {
      leadText: "I'm a software engineer based in India, building AI-powered and RAG applications, modern web experiences, and automation tools. I enjoy turning",
      interactiveWords: [
        {
          word: "complex",
          tone: "complex",
          related: ["layered", "systems", "nuanced", "architecture"]
        },
        {
          word: "fast",
          tone: "fast",
          related: ["smooth", "lightweight", "scalable", "snappy"]
        },
        {
          word: "intuitive",
          tone: "intuitive",
          related: ["accessibility", "clarity", "ergonomic", "simple"]
        }
      ],
      trailText: "ideas into products that are fast, intuitive, and built to last."
    },
    // Currently list in About
    currently: [
      "Building Klipp",
      "bringing ideas live",
      "open to freelance"
    ]
  },

  // Projects Section
  projects: [
    {
      id: "modular-platform",
      title: "Modular Platform",
      status: "WIP",
      details: {
        summary: "Plugin-based application platform designed around an event-driven architecture.",
        expectedFeatures: [
          "Plugin SDK",
          "Marketplace",
          "Runtime Loading",
          "Permissions",
          "Developer API"
        ]
      }
    },
    {
      id: "messh",
      title: "mesSh",
      status: "WIP"
    },
    {
      id: "interactive-portfolio",
      title: "Interactive Portfolio",
      status: "2026"
    },
    {
      id: "klipp",
      title: "Klipp",
      status: "Private"
    },
    {
      id: "community-automation",
      title: "Community Automation Systems",
      status: "2020–2026"
    },
    {
      id: "akyn-music",
      title: "Akyn Music",
      status: "Active",
      href: "https://akynbot.vercel.app/",
      details: {
        summary: "Music integration powering 5,000+ Discord communities.",
        role: "Infrastructure Engineer",
        stack: ["Node.js", "Seyfer.js", "Redis", "Docker"],
        highlights: [
          "5,000+ servers",
          "Millions of users",
          "Infrastructure",
          "Maintenance",
          "Feature development"
        ]
      }
    },
    {
      id: "hive-gg",
      title: "Hive.gg Automations",
      status: "2025",
      href: "https://hive.gg"
    },
    {
      id: "street-mob",
      title: "Street Mob Music",
      status: "confidential"
    },
    {
      id: "babyalien",
      title: "BabyAlien",
      status: "confidential"
    }
  ],

  // Blog Section (Interactive ASCII Art Background)
  blog: {
    asciiMedia: "./assets/blog/coming-soon.gif", // Can be a GIF, MP4, WebM, or image
    overlayText: "Coming soon",
    asciiRamp: " .:-=+*#%@",
    font: 'ui-monospace, "Cascadia Mono", "SF Mono", Menlo, Consolas, monospace'
  },

  // Contact Section
  contact: {
    email: "aditya@zer01.studio",
    links: [
      {
        label: "Email",
        href: "mailto:aditya@zer01.studio",
        copyOnClick: true,
        copyValue: "aditya@zer01.studio"
      },
      {
        label: "X (Twitter)",
        href: "https://x.com",
        target: "_blank"
      },
      {
        label: "Instagram",
        href: "https://instagram.com",
        target: "_blank"
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com",
        target: "_blank"
      }
    ]
  }
};
