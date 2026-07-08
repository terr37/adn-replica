'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, ChevronDown, ShoppingCart, LogOut, Settings, UserCircle, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../presentation/CartContext';

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
  { id: 1, title: 'Trámite URB-002 actualizado', description: 'Plaza Comercial Gazcue pasó a estado EN REVISIÓN', time: 'Hace 5 min', unread: true },
  { id: 2, title: 'Pago registrado', description: 'Recolección Especial — RD$800.00 confirmado', time: 'Hace 1 hora', unread: true },
  { id: 3, title: 'Incidencia resuelta', description: 'Bache profundo en Lope de Vega — cerrada', time: 'Hace 3 horas', unread: false },
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
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

          {/* Cart Badge */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center relative text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#B8902F] text-[#051429] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#051429]">
                {itemCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="w-10 h-10 rounded-full flex items-center justify-center relative text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#B8902F] rounded-full border border-[#051429]"></span>
            </button>

            {showNotifications && (
              <div className="absolute top-full mt-2 right-0 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#051429]/15 border border-slate-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-black text-[#051429]">Notificaciones</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>
                {MOCK_NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? 'bg-[#B8902F]/5' : ''}`}>
                    <div className="flex items-start gap-2">
                      {n.unread && <span className="w-2 h-2 bg-[#B8902F] rounded-full mt-1.5 flex-shrink-0"></span>}
                      <div className={n.unread ? '' : 'ml-4'}>
                        <p className="text-sm font-bold text-[#051429]">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3 text-center">
                  <button className="text-xs font-bold text-[#B8902F] hover:text-[#051429] transition-colors">Ver todas las alertas</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-3 pl-4 sm:pl-5 ml-2 sm:ml-3 border-l border-white/10 cursor-pointer hover:opacity-90 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 shadow-sm flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute top-full mt-2 right-0 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#051429]/15 border border-slate-100 overflow-hidden z-50">
                <div className="px-4 py-4 border-b border-slate-100">
                  <p className="text-sm font-black text-[#051429]">Juan Pérez</p>
                  <p className="text-xs text-slate-400 mt-0.5">juan.perez@adn.gob.do</p>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                    <UserCircle className="w-4 h-4 text-slate-400" /> Mi Perfil
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                    <Settings className="w-4 h-4 text-slate-400" /> Ajustes
                  </button>
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold">
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
