import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube, Instagram, ExternalLink, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0F2C59] text-white">
      {/* Top multi-color band */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-adn-blue"></div>
        <div className="flex-1 bg-adn-yellow"></div>
        <div className="flex-1 bg-adn-orange"></div>
        <div className="flex-1 bg-adn-magenta"></div>
        <div className="flex-1 bg-adn-green"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

        {/* Column 1: Identity */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-16 bg-[#1a3d73] flex items-center justify-center flex-shrink-0 shadow-lg">
              <img src="https://yt3.googleusercontent.com/ytc/AIdro_ndPZJSVVbtVmu6iy0B1gRVD8gvrOhX1QAg4JpRNCH3lEI=s900-c-k-c0x00ffffff-no-rj" alt="Escudo con leones" className="w-full h-full object-cover mix-blend-screen opacity-100 inset-0" />
            </div>
            <div>
              <p className="font-sans font-black text-white text-base tracking-widest leading-tight">ALCALDÍA</p>
              <p className="text-white/50 text-[10px] tracking-[0.2em] font-medium uppercase">Distrito Nacional</p>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            La Alcaldía del Distrito Nacional es el organismo municipal encargado de la gestión, planificación y
            administración de los recursos y servicios de Santo Domingo, República Dominicana.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-2">
            {[
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Twitter, label: 'Twitter/X' },
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Youtube, label: 'YouTube' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Legal & Navigation */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Navegación Legal</h3>
          <nav className="flex flex-col gap-3">
            {[
              'Términos de Uso',
              'Política de Privacidad',
              'Mapa del Sitio',
              'Preguntas Frecuentes (FAQ)',
              'Portal de Transparencia',
              'Trámites en Línea',
              'Noticias Municipales',
              'Sala de Prensa',
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* Column 3: Contact & Legitimacy */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Contacto y Legitimidad</h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-adn-blue mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white/80 font-medium">Palacio Municipal</p>
                <p className="text-sm text-white/40 mt-0.5 leading-relaxed">
                  Calle Leopoldo Navarro esq. Av. México,<br />
                  Santo Domingo, D.N., Rep. Dom.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-adn-green flex-shrink-0" />
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider">Línea Ciudadana</p>
                <a href="tel:+18095354646" className="text-sm text-white/70 hover:text-white transition-colors">
                  (809) 535-4646
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-adn-orange flex-shrink-0" />
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider">Correo Oficial</p>
                <a href="mailto:info@adn.gob.do" className="text-sm text-white/70 hover:text-white transition-colors">
                  info@adn.gob.do
                </a>
              </div>
            </div>

            {/* RNC */}
            <div className="mt-2 pt-5 border-t border-white/10">
              <p className="text-xs text-white/25 uppercase tracking-widest mb-1">Registro Nacional del Contribuyente</p>
              <p className="text-sm font-mono text-white/50 tracking-widest">RNC: 4-01-00016-7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Alcaldía del Distrito Nacional. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/20">
            Portal Ciudadano Digital · Santo Domingo, República Dominicana
          </p>
        </div>
      </div>
    </footer>
  );
};
