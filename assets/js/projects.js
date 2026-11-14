/* =========================================================
   PROJECT DATA — edit this file to add / change projects.
   Each project automatically appears on Home (first 4),
   Projects page, and gets its own Project Details page:
   project-details.html?p=<slug>

   c1 = card background · c2 = main UI colour · c3 = secondary
   mock = "browser" | "phones" | "dashboard"
   image (optional) = path to a real screenshot, e.g. "assets/img/finora.jpg"
   ========================================================= */
window.SKT_PROJECTS = [
  {
    slug: "finora",
    title: "Finora",
    tagline: "A calmer way to manage money",
    type: "Mobile App · Concept",
    cats: ["uiux"],
    tags: ["UI/UX", "Mobile App"],
    role: "UI/UX Designer",
    year: "2025",
    services: "Research, UX, UI, Prototype",
    tools: "Figma, FigJam, Protopie",
    c1: "#2442FF", c2: "#111111", c3: "#8EA0FF",
    mock: "phones",
    summary: "A personal-finance app that turns budgets, savings goals and spending into a simple, friendly daily check-in.",
    challenge: "Most finance apps overwhelm people with charts and jargon. The goal was to make checking your money feel as easy as checking the weather — quick, clear and stress-free.",
    approach: "I mapped the key moments people open a finance app, then designed around three jobs: “Am I okay this month?”, “Where did my money go?” and “Am I on track for my goal?”. Each became a focused screen with one clear answer.",
    solution: "A clean card-based interface with plain-language insights, goal progress you can see at a glance and a reusable component library so the product can grow without losing consistency."
  },
  {
    slug: "verde-market",
    title: "Verde Market",
    tagline: "Fresh groceries, delivered fast",
    type: "E-commerce Website",
    cats: ["web", "uiux"],
    tags: ["Web Dev", "E-commerce"],
    role: "Designer & Developer",
    year: "2025",
    services: "UI Design, Front-end, CMS",
    tools: "Figma, HTML, CSS, JavaScript",
    c1: "#111111", c2: "#2442FF", c3: "#E4E3DC",
    mock: "browser",
    summary: "A responsive online grocery store with smart search, quick add-to-cart and a checkout that works beautifully on mobile.",
    challenge: "Grocery shoppers buy many items at once, often on their phones. Browsing had to be fast and the cart always within reach.",
    approach: "I designed a mobile-first product grid with sticky categories, one-tap quantity controls and a persistent mini-cart, then built it with lightweight, accessible front-end code.",
    solution: "A fast, conversion-focused storefront with a friendly visual identity, clear product cards and a streamlined three-step checkout."
  },
  {
    slug: "nimbus",
    title: "Nimbus Analytics",
    tagline: "Dashboards that tell a story",
    type: "SaaS Dashboard",
    cats: ["uiux", "web"],
    tags: ["Dashboard", "Design System"],
    role: "Product Designer & Front-end",
    year: "2024",
    services: "UX, UI, Design System, React",
    tools: "Figma, React, TypeScript",
    c1: "#E4E3DC", c2: "#2442FF", c3: "#111111",
    mock: "dashboard",
    summary: "An analytics dashboard and design system for a SaaS product — from data-heavy tables to clear, actionable charts.",
    challenge: "Teams were drowning in numbers but missing the insights. The interface needed to surface what matters first and keep detail one click away.",
    approach: "I ran a content audit of every metric, grouped them by decision, and designed a modular widget system with consistent tokens for colour, spacing and type.",
    solution: "A flexible, accessible dashboard built from reusable React components, with a documented design system shared by design and engineering."
  },
  {
    slug: "atelier",
    title: "Atelier Studio",
    tagline: "Architecture, beautifully framed",
    type: "Portfolio Website",
    cats: ["web"],
    tags: ["Web Dev", "Animation"],
    role: "Designer & Developer",
    year: "2024",
    services: "Art Direction, UI, Development",
    tools: "Figma, HTML, CSS, GSAP",
    c1: "#2442FF", c2: "#111111", c3: "#C9D1FF",
    mock: "browser",
    summary: "An editorial portfolio site for an architecture studio, with large imagery, smooth transitions and a minimal, gallery-like feel.",
    challenge: "The studio's work is visual and spatial, but their old site hid projects behind small thumbnails and slow pages.",
    approach: "I art-directed a typographic, whitespace-led layout, then developed it with smooth page transitions and scroll-driven reveals that never slow the content down.",
    solution: "A refined, fast-loading website that lets the photography lead, with an easy-to-update project template for the team."
  },
  {
    slug: "pulse",
    title: "Pulse Fitness",
    tagline: "Your training, in rhythm",
    type: "Mobile App · Concept",
    cats: ["uiux"],
    tags: ["UI/UX", "Mobile App"],
    role: "UI/UX Designer",
    year: "2024",
    services: "UX Research, UI, Motion",
    tools: "Figma, After Effects",
    c1: "#111111", c2: "#2442FF", c3: "#8EA0FF",
    mock: "phones",
    summary: "A workout-tracking app with energetic visuals, simple logging and motivating progress views.",
    challenge: "Logging workouts mid-session is fiddly. People need big targets, minimal typing and instant feedback.",
    approach: "I tested logging flows with gym-goers, then designed thumb-friendly controls, bold progress rings and short micro-animations that reward every set.",
    solution: "An energetic, high-contrast app experience that makes tracking quick and progress feel rewarding."
  },
  {
    slug: "brew-co",
    title: "Brew & Co.",
    tagline: "Small-batch coffee, big personality",
    type: "Landing Page",
    cats: ["web", "uiux"],
    tags: ["Landing Page", "Branding"],
    role: "Designer & Developer",
    year: "2023",
    services: "Visual Design, Front-end",
    tools: "Figma, HTML, CSS, JavaScript",
    c1: "#E4E3DC", c2: "#111111", c3: "#2442FF",
    mock: "browser",
    summary: "A playful, responsive landing page for a specialty coffee brand, with menu highlights and an online order call-to-action.",
    challenge: "The brand needed a web presence as warm and characterful as their café — and it had to convert visitors into orders.",
    approach: "I built a bold visual language from their packaging, then designed a single scrolling story leading to a clear ‘Order now’ action.",
    solution: "A lively, fast landing page with playful scroll animations, a mobile-friendly menu and a prominent ordering flow."
  }
];
