'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Transparencia', href: '/transparencia' },
  { label: 'Proyectos', href: '/proyectos' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // ESTADOS DE CONTROL DE SESIÓN
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // 1. Inicialización y Reactividad Basada en Cambios de Ruta (Solución para persistencia del Layout de Next.js)
  useEffect(() => {
    setIsMounted(true);
    const session = localStorage.getItem('userSession');
    setUser(session ? JSON.parse(session) : null);
  }, [pathname]); // Se dispara automáticamente en cada navegación

  // 2. Reactividad en Tiempo Real mediante Eventos del Navegador (Misma pestaña y pestañas cruzadas)
  useEffect(() => {
    const handleAuthChange = () => {
      const session = localStorage.getItem('userSession');
      setUser(session ? JSON.parse(session) : null);
    };

    // Escucha el evento personalizado local y el evento nativo storage (para sincronizar pestañas)
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  // Cerrar dropdown si se hace click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    document.cookie = 'session_token=; path=/; max-age=0;';
    setUser(null);

    // Despachar evento para notificar a cualquier otro componente reactivo montado
    window.dispatchEvent(new Event('auth-change'));

    setIsDropdownOpen(false);
    router.push('/login');
  };

  const filteredSuggestions = searchQuery.length > 0
    ? SEARCH_SUGGESTIONS.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : SEARCH_SUGGESTIONS.slice(0, 5);

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-[#051429]/70 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)] z-50 transition-all duration-300 animate-fade-in-down">

      {/* Línea de color de marca */}
      <div className="absolute top-0 left-0 w-full h-[2px] flex opacity-90">
        <div className="flex-1 bg-adn-blue"></div>
        <div className="flex-1 bg-adn-yellow"></div>
        <div className="flex-1 bg-adn-orange"></div>
        <div className="flex-1 bg-adn-magenta"></div>
        <div className="flex-1 bg-adn-green"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">

        {/* Links de Navegación */}
        <nav className="flex-1 items-center gap-8 hidden md:flex">
          {NAV_LINKS.map(link => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-sm transition-colors relative ${isActive
                  ? 'text-[#E9D9AE] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#B8902F]'
                  : 'text-slate-300 hover:text-[#B8902F]'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logo de la Alcaldía */}
        <Link href="/" className="flex-shrink-0 flex items-center justify-center cursor-pointer group">
          <div className="w-12 h-14 bg-[#051429] border-x border-b border-white/10 flex flex-col items-center justify-center rounded-b-2xl shadow-md group-hover:shadow-lg transition-all relative mt-[-10px] pt-2 overflow-hidden">
            <img
              src="https://yt3.googleusercontent.com/ytc/AIdro_ndPZJSVVbtVmu6iy0B1gRVD8gvrOhX1QAg4JpRNCH3lEI=s900-c-k-c0x00ffffff-no-rj"
              alt="Escudo del Distrito Nacional"
              className="w-full h-full object-cover mix-blend-screen opacity-95 absolute inset-0"
            />
          </div>
          <div className="ml-4 flex flex-col hidden sm:flex">
            <span className="font-sans font-black text-white text-sm tracking-widest leading-tight">ALCALDÍA</span>
            <span className="font-sans text-[10px] text-[#E9D9AE] tracking-[0.2em] font-medium uppercase">Distrito Nacional</span>
          </div>
        </Link>

        {/* Acciones y Autenticación */}
        <div className="flex-1 flex items-center justify-end gap-6">

          {/* Buscador de servicios con sugerencias */}
          <div ref={searchRef} className="hidden lg:flex items-center relative transition-all w-64">
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

          {/* Bloque de Autenticación Condicional */}
          {isMounted && (
            <div className="flex items-center gap-3 pl-6 border-l border-white/10 relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors text-left"
                  >
                    <div className="hidden xl:flex flex-col text-right">
                      <span className="text-xs font-bold text-white max-w-[110px] truncate">
                        {user.name ? `${user.name.split(' ')[0]} ${user.name.split(' ')[1] || ''}` : 'Usuario'}
                      </span>
                      <span className="text-[9px] text-[#E9D9AE] font-mono tracking-wider uppercase">Contribuyente</span>
                    </div>
                    <div className="w-9 h-9 bg-[#B8902F]/10 rounded-xl flex items-center justify-center border border-[#B8902F]/20 text-[#B8902F]">
                      <User className="w-4 h-4" />
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <p className="text-sm font-bold text-[#051429] truncate">{user.name || 'Contribuyente'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email || ''}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/?modal=history"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#051429] rounded-lg transition-colors"
                        >
                          Mi Historial de Pagos
                        </Link>
                      </div>
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-[#B8902F] hover:bg-white text-[#051429] px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-md shrink-0"
                >
                  Portal Ciudadano <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};