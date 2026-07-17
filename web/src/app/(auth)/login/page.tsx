'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authRepository } from '@/features/auth/data/authRepository';
import { Landmark, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const session = await authRepository.login({ email, password });
      // Store session in localStorage for client-side state
      localStorage.setItem('userSession', JSON.stringify(session));
      // Set cookie for middleware protection
      document.cookie = `session_token=${session.token}; path=/; max-age=86400; SameSite=Strict`;

      // Disparar el evento para notificar al Header antes de cambiar de ruta
      window.dispatchEvent(new Event('auth-change'));

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#B8902F] mb-4 border border-white/10">
          <Landmark size={24} />
        </div>
        <h1 className="text-2xl font-sans font-black text-white tracking-tight">Acceso Ciudadano</h1>
        <p className="text-slate-300 text-sm mt-1 text-center">Gestione sus trámites y pagos municipales</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8902F]/50 focus:border-transparent transition-all"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8902F]/50 focus:border-transparent transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#B8902F] hover:bg-[#a17e29] text-[#051429] font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Autenticando...</span>
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-400 text-sm">
          ¿No tiene cuenta?{' '}
          <Link href="/register" className="text-[#B8902F] font-bold hover:underline">
            Regístrese aquí
          </Link>
        </p>
        <Link href="/" className="inline-block mt-4 text-xs text-slate-500 hover:text-white transition-colors">
          &larr; Volver al inicio
        </Link>
      </div>
    </div>
  );
}
