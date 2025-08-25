'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchBar } from './search-bar'
import { Footer } from './footer'
import { RouteLoadingWrapper } from '@/components/ui/route-loading-wrapper'
import { Button } from '@/components/ui/button'
import { TypeBadge } from '@/components/cards/type-badge'
import { useFiltersStore } from '@/store/filters'
import { useCompareStore } from '@/store/compare'
import { TYPE_COLORS } from '@/lib/theme'
import { TypeName } from '@/types/pokemon'
import { Menu, X, Home, BookOpen, BarChart3, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { addType, removeType, types: selectedTypes } = useFiltersStore()
  const { pokemon: comparedPokemon } = useCompareStore()
  const { theme, setTheme } = useTheme()
  
  const typeOptions = Object.keys(TYPE_COLORS) as TypeName[]
  
  const toggleType = (type: TypeName) => {
    if (selectedTypes.includes(type)) {
      removeType(type)
    } else {
      addType(type)
    }
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Pokédex', href: '/pokedex', icon: BookOpen },
    { name: 'Compare', href: '/compare', icon: BarChart3, badge: comparedPokemon.length },
  ]
  
  return (
    <div className="min-h-screen bg-background">
      {/* Route Loading Indicator */}
      <RouteLoadingWrapper />
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
              <span className="inline-block font-bold">Ultimate Pokédex</span>
            </Link>
            
            <nav className="hidden lg:flex gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground relative"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <div className="w-full flex-1 lg:w-auto lg:flex-none">
              <SearchBar className="w-full lg:w-72" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              className="lg:hidden"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-background border-t backdrop-blur-sm bg-background/95">
          <nav className="grid gap-6 p-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
                {item.badge && item.badge > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
      
      {/* Type Filter Quick Bar */}
      <div className="border-b bg-muted/50 py-2 overflow-x-auto">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 min-w-max">
            {typeOptions.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`transition-all ${
                  selectedTypes.includes(type) 
                    ? 'scale-105 ring-2 ring-offset-2 ring-blue-500' 
                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
              >
                <TypeBadge type={type} className="cursor-pointer" />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}