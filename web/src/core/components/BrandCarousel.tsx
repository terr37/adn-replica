'use client';

import React from 'react';

interface Partner {
  name: string;
  abbr: string;
  logo: string;   // URL of the logo image
  color: string;  // Brand accent color for hover glow
}

// Using publicly accessible logo images from Wikimedia Commons and official sources
const partners: Partner[] = [
  {
    name: 'Ministerio de Educación',
    abbr: 'MINERD',
    logo: 'https://apps.minerd.gob.do/seregtecdocentes/Content/App/RegularizacionTecnicosDocentes202202.png',
    color: '#00AEEF',
  },
  {
    name: 'Ministerio de Salud Pública',
    abbr: 'MSP',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2i7KKjdk-4u0IqZ8UESK00a2sXY42CACQtiLTRApheN_7y5CX181klGM&s=10',
    color: '#00A651',
  },
  {
    name: 'Ministerio de Obras Públicas',
    abbr: 'MOPC',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSSHB_cMNrCx_j2LXKrkL8fK_E6GZCs2rMBby0ifStmr4cs8MYJ1P7AP4&s=10',
    color: '#F7941E',
  },
  {
    name: 'Policía Nacional',
    abbr: 'PN',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Policia_Nacional_Republica_Dominicana_emblem.jpg',
    color: '#051429',
  },
  {
    name: 'Defensa Civil',
    abbr: 'DC',
    logo: 'https://defensacivil.gob.do/images/Log%20DC%20Nueva%20versio%CC%81n5-01.png',
    color: '#EC008C',
  },
  {
    name: 'Cuerpo de Bomberos DN',
    abbr: 'CBDN',
    logo: 'https://0201.nccdn.net/4_2/000/000/038/2d3/LOGO-BOMBEROS-OFICIAL-PNG-PEQ.png',
    color: '#D00000',
  },
  {
    name: 'FEDOMU',
    abbr: 'FEDOMU',
    logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQED2wmL-gh4Bw/company-logo_400_400/company-logo_400_400/0/1646509962227?e=2147483647&v=beta&t=gxQ1yq7zQfEgCS_raDxWISUNZl7elEklNl2lZg4irms',
    color: '#FFD500',
  },
  {
    name: 'Alcaldía de Santo Domingo Este',
    abbr: 'ASDE',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRexsp5Kz1rC_FgPcmqwBSskz8p_ER7gqHEk0qFSzfWSIfGijXHViPXT9Lv&s=10',
    color: '#00AEEF',
  },
  {
    name: 'Ministerio de Medio Ambiente',
    abbr: 'MA',
    logo: 'https://dominicanasolidaria.org/wp-content/uploads/2018/12/logo-ministerio-medio-ambiente-y-recursos-naturales.jpg',
    color: '#00A651',
  },
  {
    name: 'Ministerio de Interior y Policía',
    abbr: 'MIP',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRThsnSqmWEpDhfm2TJtlo8VPgpyj54wd91yIRcBFK_DwMWiegx30hC7IA&s=10',
    color: '#F7941E',
  },
];

const PartnerLogo: React.FC<{ partner: Partner }> = ({ partner }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className="group flex-shrink-0 flex flex-col items-center justify-center gap-3 w-44 mx-8 cursor-default"
      title={partner.name}
    >
      {/* Logo container */}
      <div
        className="w-24 h-24 rounded-full border border-gray-100 bg-white flex items-center justify-center p-4 shadow-sm
                   grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100
                   group-hover:shadow-lg group-hover:border-transparent
                   transition-all duration-500"
        style={{ '--hover-shadow': `0 8px 30px ${partner.color}30` } as React.CSSProperties}
      >
        {!imgError ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-full h-full rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Styled fallback badge */
          <div
            className="w-full h-full rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${partner.color}15` }}
          >
            <span
              className="font-black text-xs text-center leading-none tracking-tight"
              style={{ color: partner.color }}
            >
              {partner.abbr}
            </span>
          </div>
        )}
      </div>

      <span className="text-[10px] font-medium text-gray-300 group-hover:text-gray-500 text-center leading-tight transition-colors duration-500 max-w-[130px]">
        {partner.name}
      </span>
    </div>
  );
};

export const BrandCarousel: React.FC = () => {
  // Duplicate list to create seamless infinite loop (animation moves -50%)
  const track = [...partners, ...partners];

  return (
    <section className="py-14 relative overflow-hidden">
      {/* Label */}
      <div className="flex items-center gap-4 justify-center mb-10">
        <div className="h-px flex-1 max-w-20 bg-gray-200"></div>
        <p className="text-[11px] font-bold tracking-[0.3em] text-gray-300 uppercase">
          Red Institucional Colaborativa
        </p>
        <div className="h-px flex-1 max-w-20 bg-gray-200"></div>
      </div>

      {/* Edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Scrolling track — mueve el div usando la clase de Tailwind */}
      <div className="overflow-hidden">
        <div
          // AQUÍ ESTÁ EL CAMBIO: quitamos el 'style' inline y usamos solo la clase
          className="flex w-max animate-marquee hover:[animation-play-state:paused]"
        >
          {track.map((partner, i) => (
            <PartnerLogo key={`${partner.abbr}-${i}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};
