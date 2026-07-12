'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const placeholders = [
  "Buscar: Permisos...",
  "Buscar: Impuestos...",
  "Buscar: Denuncias...",
  "Buscar: Trámites...",
  "Buscar: Obras..."
];

const SEARCH_SUGGESTIONS = [
  { label: 'Permisos de Construcción', href: '/servicios' },
  { label: 'Recolección Especial', href: '/servicios' },
  { label: 'Uso de Espacio Público', href: '/servicios' },
  { label: 'Registro Comercial', href: '/servicios' },
  { label: 'Portal de Transparencia', href: '/transparencia' },
  { label: 'Proyectos Estratégicos', href: '/proyectos' },
  { label: 'Iniciar Nuevo Trámite', href: '/tramites/nuevo' },
  { label: 'Publicidad Exterior', href: '/servicios' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Información de servicios actualizada', description: 'Nueva información de trámites y requisitos disponible', time: 'Hace 5 min', unread: true },
  { id: 2, title: 'Cambio de horario', description: 'Actualización en horarios de atención de ventanillas', time: 'Hace 1 hora', unread: true },
  { id: 3, title: 'Cierre programado', description: 'Cierre de atención el próximo lunes festivo', time: 'Hace 3 horas', unread: false },
];

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Transparencia', href: '/transparencia' },
  { label: 'Proyectos', href: '/proyectos' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredSuggestions = searchQuery.length > 0
    ? SEARCH_SUGGESTIONS.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : SEARCH_SUGGESTIONS.slice(0, 5);

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-[#051429]/70 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)] z-50 transition-all duration-300 animate-fade-in-down">

      {/* Brand Color Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] flex opacity-90">
        <div className="flex-1 bg-adn-blue"></div>
        <div className="flex-1 bg-adn-yellow"></div>
        <div className="flex-1 bg-adn-orange"></div>
        <div className="flex-1 bg-adn-magenta"></div>
        <div className="flex-1 bg-adn-green"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">

        {/* Left: Navigation Links */}
        <nav className="flex-1 flex items-center gap-8 hidden md:flex">
          {NAV_LINKS.map(link => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-sm transition-colors relative ${
                  isActive
                    ? 'text-[#E9D9AE] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#B8902F]'
                    : 'text-slate-300 hover:text-[#B8902F]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Center: Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center justify-center cursor-pointer group">
          <div className="w-12 h-14 bg-[#051429] border-x border-b border-white/10 flex flex-col items-center justify-center rounded-b-2xl shadow-md group-hover:shadow-lg transition-all relative mt-[-10px] pt-2 overflow-hidden">
            <img
              src="https://yt3.googleusercontent.com/ytc/AIdro_ndPZJSVVbtVmu6iy0B1gRVD8gvrOhX1QAg4JpRNCH3lEI=s900-c-k-c0x00ffffff-no-rj"
              alt="Escudo con leones"
              className="w-full h-full object-cover mix-blend-screen opacity-95 absolute inset-0"
            />
          </div>
          <div className="ml-4 flex flex-col hidden sm:flex">
            <span className="font-sans font-black text-white text-sm tracking-widest leading-tight">ALCALDÍA</span>
            <span className="font-sans text-[10px] text-[#E9D9AE] tracking-[0.2em] font-medium uppercase">Distrito Nacional</span>
          </div>
        </Link>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-4">

          {/* Search Input with Dropdown */}
          <div ref={searchRef} className="hidden sm:flex items-center relative transition-all w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-[#B8902F]/30 focus:border-[#B8902F]/40 focus:bg-white/10 outline-none transition-all placeholder-slate-400"
            />
            {isSearchFocused && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#051429]/15 border border-slate-100 overflow-hidden z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {searchQuery ? 'Resultados' : 'Sugerencias'}
                  </span>
                </div>
                {filteredSuggestions.length > 0 ? filteredSuggestions.map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    onClick={() => { setIsSearchFocused(false); setSearchQuery(''); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#051429] hover:bg-slate-50 transition-colors font-medium"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    {s.label}
                  </Link>
                )) : (
                  <div className="px-4 py-6 text-center text-sm text-slate-400">Sin resultados para &quot;{searchQuery}&quot;</div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 pl-4 sm:pl-5 ml-2 sm:ml-3 border-l border-white/10">
            <Phone className="w-5 h-5 text-[#B8902F]" />
            <span className="text-sm font-semibold hidden sm:inline">809-535-1181</span>
          </div>

        </div>

      </div>
    </header>
  );
};
