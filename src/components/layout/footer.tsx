'use client'

import Link from 'next/link'
import { Github, Heart, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
              <span className="font-bold text-lg">Ultimate Pokédex</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              A modern, fast, and beautiful Pokédex application. 
              Discover, explore, and compare your favorite Pokémon with powerful features.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pokedex" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pokédex
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/pokedex?legendary=true" className="text-muted-foreground hover:text-foreground transition-colors">
                  Legendary Pokémon
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://pokeapi.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  PokeAPI
                </a>
              </li>
              <li>
       
              </li>
              <li>
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-500" />
                  Made with love
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Ultimate Pokédex. Built for Pokémon fans worldwide.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Kraeg Avila</span>
              <span>•</span>
              <span>Data from PokeAPI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}