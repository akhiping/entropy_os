# Entropy - The Operating System for Knowledge Work

A revolutionary AI-native operating system for knowledge work. A premium, cutting-edge prototype that visualizes your entire digital workspace as a living knowledge graph.

![Entropy Landing Page](./docs/landing.png)

## Overview

Entropy is a spatial interface that breaks conventions and sets new standards for what AI productivity tools can look like. It's designed to make investors and users say "whoa" within the first 3 seconds.

### Key Features

- **Visual Intelligence**: See your entire digital workspace as a living knowledge graph
- **AI Orchestration**: Autonomous agents that understand context across all your tools
- **Unified Context**: One place to see everything, connected intelligently
- **Command Palette**: Raycast-inspired ⌘K interface for rapid navigation
- **Real-time Graph Physics**: D3.js force simulation with custom physics

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router framework |
| **TypeScript** | Strict type safety |
| **Tailwind CSS** | Styling with custom CSS variables |
| **Framer Motion** | Premium animations and micro-interactions |
| **D3.js** | Force-directed graph simulation |
| **Zustand** | Lightweight state management |
| **Lucide React** | Beautiful icons |

## Project Structure

```
entropy/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard/graph view
│   ├── globals.css           # Global styles + CSS variables
│   └── layout.tsx            # Root layout
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx        # Landing page navigation
│   │   ├── Hero.tsx          # Hero section with CTA
│   │   ├── GraphPreview.tsx  # Animated mini-graph preview
│   │   └── Features.tsx      # Features section
│   ├── dashboard/
│   │   ├── GraphCanvas.tsx   # Main D3.js graph visualization
│   │   ├── Node.tsx          # Individual node component
│   │   ├── NodeDetail.tsx    # Detail panel (slides from right)
│   │   ├── AIChat.tsx        # AI assistant modal
│   │   ├── CommandPalette.tsx# ⌘K command palette
│   │   ├── Navbar.tsx        # Dashboard navigation
│   │   ├── Toolbar.tsx       # Floating bottom toolbar
│   │   └── FilterPanel.tsx   # Node filtering panel
│   └── ui/
│       ├── Button.tsx        # Reusable button component
│       ├── Input.tsx         # Reusable input component
│       └── Card.tsx          # Glass morphism card
├── lib/
│   ├── store.ts              # Zustand state management
│   ├── mockData.ts           # 30 sample nodes + edges
│   ├── animations.ts         # Framer Motion variants
│   └── types.ts              # TypeScript type definitions
└── tailwind.config.ts        # Custom color system
```

## Design System

### Color Palette (Deep Space Theme)

```css
/* Background */
--bg-void: #000000
--bg-deep: #0A0A0F
--bg-surface: #141419
--bg-elevated: #1C1C24

/* Accents */
--accent-energy: #00FFA3    /* Electric mint - Primary CTA */
--accent-plasma: #FF006E    /* Hot pink - Warnings */
--accent-void: #8B5CF6      /* Deep purple - AI/Magic */
--accent-solar: #FFB800     /* Golden amber - Success */
--accent-frost: #00E0FF     /* Cyan - Information */
```

### Node Types & Colors

| Type | Color | Description |
|------|-------|-------------|
| **Repository** | Purple gradient | GitHub repos with stars, language, commits |
| **Document** | Pink gradient | Notion pages, Google Docs |
| **Task/Issue** | Cyan gradient | Issues, Jira tickets with progress |
| **AI Agent** | Green gradient | Special pulsing nodes |
| **Misc** | Amber gradient | Browser tabs, notes |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the entropy directory
cd entropy

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Key Interactions

### Landing Page (/)
- Stunning hero with animated background gradients
- Interactive graph preview with floating nodes
- Smooth scroll animations
- Glass morphism navbar

### Dashboard (/dashboard)

| Interaction | Description |
|-------------|-------------|
| **Click node** | Opens detail panel, dims other nodes |
| **Hover node** | Scale up, glow effect, show connections |
| **Drag node** | Physics-based dragging with D3 simulation |
| **Pan canvas** | Drag on background |
| **Zoom** | Mouse wheel or toolbar buttons |
| **⌘K** | Open command palette |
| **Press F** | Fit all nodes to view |
| **Press L** | Auto-layout (re-run simulation) |
| **Ctrl+F** | Open filter panel |
| **Esc** | Close any open panel/modal |

### AI Chat
- Click "Ask AI" button or use command palette
- Suggested prompts: "Summarize my workspace", "What's blocking me?", etc.
- Simulated AI responses with typing effect
- Message history with timestamps

### Command Palette (⌘K)
- Fuzzy search across all nodes
- Quick commands: Open AI Chat, Sync, Export, Fit View
- Recent items section
- Keyboard navigation (↑/↓ to navigate, ↵ to select)

## State Management (Zustand)

```typescript
interface GraphState {
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
  hoveredNodeId: string | null
  showAIChat: boolean
  showCommandPalette: boolean
  filterOptions: FilterOptions
  viewMode: 'graph' | 'list' | 'timeline'
  
  // Actions
  selectNode: (id: string | null) => void
  hoverNode: (id: string | null) => void
  toggleAIChat: () => void
  toggleCommandPalette: () => void
  updateNode: (id: string, updates: Partial<Node>) => void
  addEdge: (source: string, target: string, type: string) => void
  setFilter: (filter: Partial<FilterOptions>) => void
}
```

## Mock Data

The prototype includes 30 realistic nodes:

- **10 Repositories**: entropy-core, entropy-web, graph-physics, ai-agents, etc.
- **8 Documents**: Product Roadmap, API Documentation, Design Principles, etc.
- **8 Tasks/Issues**: OAuth2 integration, Graph optimization, AI expansion, etc.
- **2 AI Agents**: Research Assistant, Code Reviewer
- **2 Misc**: YC Demo Day Prep, Competitor Analysis

## Animation System

Custom Framer Motion variants in `/lib/animations.ts`:

- `fadeIn` - Opacity animation
- `fadeUp` - Fade + slide up
- `scaleIn` - Scale from 0 to 1
- `slideInRight` - Slide from right (panels)
- `staggerContainer` - Parent for staggered children
- `glowPulse` - Node glow effect
- `floatAnimation` - Gentle floating motion

## Performance Optimizations

- **Viewport culling**: Only render visible nodes
- **Memoized components**: React.memo for nodes
- **RequestAnimationFrame**: Smooth D3 animations
- **GPU-accelerated**: Uses transform/opacity
- **Lazy loading**: Dynamic imports for heavy components
- **Throttled events**: Mouse move handlers optimized

## Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Desktop (1440px+) | Full experience |
| Laptop (1024px-1439px) | Narrower panels |
| Tablet (768px-1023px) | Overlay panels |
| Mobile (<768px) | Simplified graph |

## Demo Flow (30 seconds)

1. **Landing page** (2s) - Hero appears with animation
2. **Click "Connect GitHub"** (1s) - Navigate to dashboard
3. **Graph appears** (3s) - Nodes animate in with physics
4. **Hover nodes** (3s) - See magnetic hover effects
5. **Click node** (3s) - Detail panel slides in
6. **Open AI chat** (2s) - Click Ask AI
7. **Send message** (8s) - "Summarize my workspace"
8. **⌘K command palette** (3s) - Show quick commands
9. **Pan and zoom** (5s) - Navigate the graph

## Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel
```

## What Makes This Special

✅ **NOT** a typical SaaS dashboard  
✅ Spatial, canvas-based interface (like Figma)  
✅ Physics-based graph simulation  
✅ Premium glass morphism and depth  
✅ Electric mint accent (not boring blue/purple)  
✅ Micro-interactions everywhere  
✅ 60fps animations  
✅ Demo-ready prototype

## License

MIT

---

Built with ❤️ for the future of knowledge work.
# entropy_os
