'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HeroSection } from '../core/components/HeroSection';
import { TaxCard } from '../features/catalog/presentation/components/TaxCard';
import { useGetCatalog } from '../features/catalog/presentation/hooks/useGetCatalog';
import { useGetIncidences } from '../features/incidences/presentation/hooks/useGetIncidences';
import { ArrowRight, Users, ChevronRight, Building2, Recycle, Trees, TreeDeciduousIcon } from 'lucide-react';
import { ScrollReveal } from '../core/components/ScrollReveal';

// Dynamic import for Leaflet map with SSR disabled
const IncidentMap = dynamic(
  () => import('../features/incidences/presentation/components/IncidentMap').then((mod) => mod.IncidentMap),
  { ssr: false, loading: () => <div className="h-[500px] bg-gray-100 rounded-2xl animate-pulse"></div> }
);

export default function Home() {
  const { data: catalogData, isLoading: isLoadingCatalog } = useGetCatalog();
  const { data: incidencesData, isLoading: isLoadingIncidences } = useGetIncidences();

  return (
    <div className="w-full bg-white flex flex-col">
      <ScrollReveal>
        <HeroSection />
      </ScrollReveal>

      {/* Servicios Destacados Section */}
      <ScrollReveal delay={0.1} parallax>
        <section className="w-full py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-sans font-black text-navy mb-2 tracking-tight">Servicios Destacados</h2>
                <p className="text-gray-500 text-base">Tasas y arbitrios de mayor demanda</p>
              </div>
              <Link href="/servicios" className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1 transition-colors">
                Ver catálogo completo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoadingCatalog ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-gray-100 rounded-2xl cursor:pointer"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {catalogData.map(tax => (
                  <TaxCard key={tax.id} tax={tax} />
                ))}
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* Ejes Estratégicos Section */}
      <ScrollReveal delay={0.1} parallax>
        <section className="w-full py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-sans font-black text-navy mb-4 tracking-tight">Ejes Estratégicos de Gestión</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Nuestro plan de trabajo se estructura en pilares fundamentales diseñados para transformar la ciudad,
                mejorando la calidad de vida de todos los capitaleños mediante acciones concretas y sostenibles.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Planificación Urbana */}
              <div className="lg:col-span-8 bg-cover bg-center rounded-3xl relative overflow-hidden min-h-[320px] group shadow-sm flex flex-col justify-end p-8" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/df/8d/01/df8d0153dbbfde677ed0208283e4eed8.jpg" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent"></div>
                <div className="relative z-10 text-white">
                  <div className="w-10 h-10 bg-navy/80 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-3xl text-white font-sans font-black tracking-tight mb-2">Planificación Urbana</h3>
                  <p className="text-gray-200 text-sm max-w-md mb-4">
                    Reordenamiento del territorio, recuperación de espacios públicos y desarrollo de infraestructuras sostenibles que priorizan al peatón.
                  </p>
                  <Link href="/proyectos" className="text-[#C1A265] hover:text-white font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Conocer proyectos <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Gestión Ambiental */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-gray-100 flex flex-col hover:shadow-soft transition-shadow shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-6">
                  <TreeDeciduousIcon className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-2xl font-sans font-black tracking-tight text-navy mb-3">Gestión Ambiental</h3>
                <p className="text-gray-500 text-sm flex-1">
                  Modernización del sistema de recolección, programas de reciclaje y educación ciudadana para una ciudad más limpia y verde.
                </p>
                <div className="mt-8 pt-4 border-t border-gray-50">
                  <Link href="/proyectos" className="text-gray-400 font-bold text-xs tracking-wider flex items-center justify-between w-full hover:text-navy transition-colors">
                    VER INDICADORES <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Desarrollo Social */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-gray-100 flex flex-col hover:shadow-soft transition-shadow shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-6">
                  <Users className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-2xl font-sans font-black tracking-tight text-navy mb-3">Desarrollo Social</h3>
                <p className="text-gray-500 text-sm flex-1">
                  Programas de inclusión, apoyo a sectores vulnerables, fomento del deporte y la cultura en los barrios del Distrito Nacional.
                </p>
                <div className="mt-8 pt-4 border-t border-gray-50">
                  <Link href="/proyectos" className="text-gray-400 font-bold text-xs tracking-wider flex items-center justify-between w-full hover:text-navy transition-colors">
                    VER PROGRAMAS <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Transparencia */}
              <div className="lg:col-span-8 bg-[#0B152A] rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col justify-center min-h-[320px]">
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-0 right-20 w-64 h-64 bg-yellow-500/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
                <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-blue-500/20 blur-[60px] rounded-full mix-blend-screen pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-start max-w-xl">
                  <span className="px-3 py-1 mb-6 rounded-md border border-white/20 text-white/80 text-[10px] font-bold tracking-wider uppercase">
                    Compromiso Cívico
                  </span>
                  <h3 className="text-4xl font-sans font-black tracking-tight text-white mb-4 leading-tight">
                    Transparencia y Datos Abiertos
                  </h3>
                  <p className="text-white/80 text-sm mb-8 max-w-md">
                    Accede a la información sobre presupuestos, licitaciones, nómina y ejecución de obras. Una gestión de puertas abiertas.
                  </p>
                  <Link href="/transparencia" className="bg-[#C1A265] hover:bg-[#b09257] text-navy font-bold text-sm px-6 py-3 rounded-lg transition-colors">
                    Portal de Transparencia
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Intervenciones Urbanas Section */}
      <ScrollReveal delay={0.1} parallax>
        <section className="w-full bg-gray-50 border-t border-gray-100">
          {isLoadingIncidences ? (
            <div className="h-[600px] w-full bg-gray-200 animate-pulse"></div>
          ) : (
            <IncidentMap />
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}
