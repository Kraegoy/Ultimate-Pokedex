# Ultimate Pokédex 🚀

A modern, production-grade Pokédex website with an "ultimate dashboard" UX—fast, beautiful, and intuitive.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)
![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154)

## ✨ Features

### 🔍 Lightning-Fast Search & Filters
- **Global search** with typeahead suggestions
- **Multi-select type filters** with visual badges
- **Generation filters** (Gen 1-9)
- **Advanced stat range sliders**
- **Persistent filter sets** - save and load your favorite combinations
- **Debounced search** (250ms) for optimal performance

### 🎨 Adaptive UI Theming
- **Dynamic type-based themes** - UI adapts to Pokémon's primary type
- **18 unique color palettes** for each Pokémon type
- **Smooth CSS variable transitions**
- **Light/Dark mode support** with system preference detection
- **Gradient backgrounds** and themed focus states

### 📊 Rich Data Visualization
- **Interactive radar charts** for stat comparison
- **Progress bars** with type-themed colors
- **KPI dashboard tiles** with trending indicators
- **Type distribution charts** (Pie charts with Recharts)
- **Side-by-side comparison tables**

### 🎯 Infinite Scroll & Performance
- **Virtualized infinite scroll** - handle 1000+ Pokémon smoothly
- **Intersection Observer** for automatic loading
- **TanStack Query** with intelligent caching (5-10min stale time)
- **Image optimization** with Next.js Image component
- **Skeleton loading states** for better UX

### ♿ Accessibility & Navigation
- **Full keyboard navigation** (/, Arrow keys, Enter, Esc)
- **ARIA labels** and semantic HTML
- **Focus management** with visible focus rings
- **Screen reader support**
- **AA+ color contrast** compliance
- **Respects motion preferences**

### 📱 Responsive Design
- **Mobile-first approach** with breakpoints: xs/sm/md/lg/xl
- **Touch-friendly interactions**
- **Responsive navigation** with mobile drawer
- **Adaptive grid layouts** (1-5 columns based on screen size)
- **Bottom sheet compare tray** on mobile

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Radix UI + Custom shadcn/ui components
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query v5
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Theme Management**: next-themes

### Project Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx               # Dashboard with KPIs & featured Pokémon
│   ├── pokedex/
│   │   └── page.tsx           # Main Pokédex with infinite scroll
│   ├── pokemon/[slug]/
│   │   └── page.tsx           # Detailed Pokémon page
│   └── compare/
│       └── page.tsx           # Side-by-side comparison
├── components/
│   ├── ui/                    # shadcn/ui base components
│   ├── cards/                 # Pokémon cards & badges
│   ├── charts/                # Data visualization components
│   ├── filters/               # Filter panels & controls
│   ├── layout/                # Navigation & app shell
│   └── providers/             # Context providers
├── lib/
│   ├── poke-api.ts           # PokeAPI integration & normalization
│   ├── theme.ts              # Type-based theming system
│   └── utils.ts              # Utility functions
├── store/
│   ├── filters.ts            # Filter state management
│   └── compare.ts            # Comparison state management
├── hooks/
│   ├── use-pokemon.ts        # TanStack Query hooks
│   └── use-intersection-observer.ts
└── types/
    └── pokemon.ts            # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pokedex-ultimate
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages & Features

### 🏠 Dashboard (`/`)
- **Hero section** with call-to-action buttons
- **KPI tiles**: Total Pokémon, fastest, strongest, most defensive
- **Quick action buttons**: Reset filters, view strongest, legendary filter
- **Type distribution chart**
- **Featured Pokémon** carousel

### 📚 Pokédex (`/pokedex`)
- **Advanced filter panel** (collapsible on mobile)
- **Global search** with live suggestions
- **Infinite scroll grid** with virtualization
- **Type quick-select bar**
- **Sort options**: ID, Name, Stats, Height, Weight
- **Mobile-responsive** with drawer navigation

### 🔍 Pokémon Details (`/pokemon/[slug]`)
- **Adaptive theming** based on Pokémon's type
- **High-quality artwork** + shiny variants
- **Comprehensive stats** with progress bars & radar chart
- **Tabbed interface**: Stats, Abilities, Moves, Evolution
- **Add to comparison** functionality
- **Share button** (ready for Web Share API)

### ⚖️ Compare (`/compare`)
- **Up to 4 Pokémon** side-by-side comparison
- **Radar chart overlay** showing all selected Pokémon
- **Detailed stats table** with totals
- **Export functionality** (ready for PDF/PNG generation)
- **Drag & drop** removal

## 🎨 Theming System

The app features a sophisticated theming system that dynamically adapts the UI based on Pokémon types:

```typescript
// Each type has a carefully chosen color palette
const TYPE_COLORS = {
  fire: '#EE8130',      // Warm orange-red
  water: '#6390F0',     // Ocean blue
  grass: '#7AC74C',     // Fresh green
  electric: '#F7D02C',  // Electric yellow
  // ... 14 more types
}
```

**Features:**
- **Dynamic CSS variables** update in real-time
- **Gradient generation** for dual-type Pokémon
- **Accessible contrast ratios** maintained across all themes
- **Smooth transitions** between theme changes

## 🔧 Configuration

### Environment Variables
No environment variables required - uses public PokeAPI.

### Customization
- **Colors**: Edit `src/lib/theme.ts`
- **Breakpoints**: Modify Tailwind config
- **API**: Extend `src/lib/poke-api.ts`
- **Cache duration**: Update TanStack Query staleTime

## 🧪 Testing

### Unit Tests (Jest + Testing Library)
```bash
npm run test
npm run test:watch
```

### Example test coverage:
- ✅ Theme color generation
- ✅ API data normalization  
- ✅ Filter logic
- ✅ Component rendering

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

## 📈 Performance

### Lighthouse Scores (Target)
- **Performance**: ≥90
- **Accessibility**: ≥95  
- **Best Practices**: ≥95
- **SEO**: ≥90

### Optimizations
- **Image optimization** with Next.js Image
- **Code splitting** with dynamic imports
- **Caching strategy** with SWR-like behavior
- **Bundle analysis** with `@next/bundle-analyzer`
- **Virtualization** for large lists

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PokeAPI** (https://pokeapi.co) for the comprehensive Pokémon data
- **The Pokémon Company** for the amazing franchise
- **Vercel** for Next.js and deployment platform
- **Radix UI** for accessible component primitives
- **Tailwind Labs** for the utility-first CSS framework

---

Built with ❤️ for Pokémon fans worldwide
