# Aditya Sah Portfolio x Ni5arga Dancing Anime Girl Theme (`adityaxnisargakeed`)

An authentic, fully modular and customizable clone of [aditya.zer01.studio](https://aditya.zer01.studio/) with the dancing anime girl (Shigure Ui) View Transition theme toggle from [ni5arga.com](https://ni5arga.com/). Reverse-engineered with REA and reconstructed for full user customization.

---

## 🚀 Quick Start

Run the site locally with any static HTTP server:

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js (npx)
npx serve .

# Option 3: VS Code / Cursor
# Open with Live Server extension
```

Navigate to `http://localhost:8000` in your browser.

---

## 🛠️ How to Customize Everything

All text, links, projects, animations, fonts, and settings are managed in a single, well-documented file:

👉 **[`config.js`](./config.js)**

### 1. Identity & Author Info
Edit the `identity` block in `config.js`:
```javascript
identity: {
  names: ["Your Name", "Your Handle"], // Typewriting names in sidebar
  madeWith: "zer01 studio",
  timezone: "Asia/Kolkata",            // Timezone for live ticking clock in footer
  locale: "en-IN"
}
```

### 2. Hero Section & Rotating Typography
Edit the `hero` block in `config.js`:
```javascript
hero: {
  titlePrefix: "Independent",
  titleSuffix: "engineer",
  rotatingAccents: [
    { word: "creative", fontClass: "accent-font-creative" },
    { word: "AI", fontClass: "accent-font-ai" },
    { word: "Cloud", fontClass: "accent-font-cloud" },
    { word: "Full-stack", fontClass: "accent-font-fullstack" },
    { word: "Automations", fontClass: "accent-font-automations" }
  ],
  bio: {
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
    ]
  },
  currently: [
    "Building cool stuff",
    "Open for contract work"
  ]
}
```

### 3. Projects List & Details Accordion
Add, remove, or modify items in the `projects` array in `config.js`:
```javascript
projects: [
  {
    id: "my-project",
    title: "Project Name",
    status: "Active", // e.g., "Active", "WIP", "2026", "Private"
    href: "https://myproject.com",
    details: {
      summary: "Short description of the project.",
      expectedFeatures: ["Feature 1", "Feature 2"],
      role: "Lead Engineer",
      stack: ["React", "Node.js", "PostgreSQL"],
      highlights: ["10k+ active users", "High availability"]
    }
  }
]
```

### 4. Blog Section & Real-Time ASCII Canvas
Customize media, character ramp, or overlay text in `config.js`:
```javascript
blog: {
  asciiMedia: "./assets/blog/coming-soon.gif", // GIF, MP4, WebM, or image
  overlayText: "Coming soon",
  asciiRamp: " .:-=+*#%@",
  font: 'ui-monospace, "Cascadia Mono", "SF Mono", Menlo, Consolas, monospace'
}
```

### 5. Contact & Social Links
Configure email copy and social platforms in `config.js`:
```javascript
contact: {
  email: "your-email@domain.com",
  links: [
    {
      label: "Email",
      href: "mailto:your-email@domain.com",
      copyOnClick: true,
      copyValue: "your-email@domain.com"
    },
    {
      label: "X (Twitter)",
      href: "https://x.com/yourhandle"
    },
    {
      label: "GitHub",
      href: "https://github.com/yourhandle"
    }
  ]
}
```

---

## ⌨️ Built-in Shortcuts & Features

| Key | Action |
| :--- | :--- |
| `t` | Toggle Dark / Light mode (with **Dancing Anime Girl View Transition**) |
| `h` | Navigate to **About** section |
| `j` | Navigate to **Projects** section |
| `k` | Navigate to **Blog** section (activates fullscreen ASCII canvas) |
| `l` | Navigate to **Contact** section |
| `Escape` | Dismiss active project details card & reset row dimming |

---

## 📁 Project Architecture

```
aditya-portfolio/
├── index.html            # Main semantic HTML structure
├── config.js             # Central configuration file for all customizations
├── README.md             # Documentation and usage guide
├── assets/
│   ├── blog/
│   │   └── coming-soon.gif # Source animation for ASCII canvas
│   ├── favicon.gif       # Favicon
│   ├── fonts.css         # Font definitions (Bodoni Moda, Orbitron, Syne, etc.)
│   └── shigure-ui-smol.gif # Dancing anime girl transition mask GIF
├── css/
│   ├── styles.css        # Authentic production styles from aditya.zer01.studio
│   └── anime-transition.css # View Transitions API dancing anime girl mask animation
└── js/
    ├── main.js           # Main application orchestrator
    ├── theme.js          # Theme management & 't' shortcut (with View Transition)
    ├── navigation.js     # Vim shortcuts, scroll spy, spotlight cursor tracking
    ├── typewriter.js     # Dual typewriter (rotating hero accents & author names)
    ├── float-tags.js     # Interactive bio keyword float badge spawner
    ├── projects.js       # Dynamic projects list, accordion details & row dimming
    ├── contact.js        # Contact rows & email copy tooltip
    ├── clock.js          # Live ticking timezone clock
    ├── ascii-canvas.js   # Real-time ASCII art rendering engine
    └── gifuct.js         # Self-contained GIF LZW decoder
```
