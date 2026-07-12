'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, FileCheck, Tent, Store, Recycle, MapPin, Clock, Phone, Info } from 'lucide-react';
import Link from 'next/link';

const TIPOS_TRAMITE = [
  { value: 'permiso_construccion', label: 'Permiso de Construcción', icon: <Building2 className="w-4 h-4" />, requisitos: ['RNC y cédula', 'Planos arquitectónicos', 'Comprobante de propiedad', 'Pago de tasa'], tasa: 'Variable según proyecto' },
  { value: 'uso_suelo', label: 'Certificación de Uso de Suelo', icon: <FileCheck className="w-4 h-4" />, requisitos: ['Cédula o RNC', 'Comprobante de propiedad', 'Plano catastral'], tasa: 'RD$ 150.00' },
  { value: 'espacio_publico', label: 'Uso de Espacio Público', icon: <Tent className="w-4 h-4" />, requisitos: ['Cédula', 'Propuesta técnica', 'Seguro de responsabilidad'], tasa: 'Variable según uso' },
  { value: 'registro_comercial', label: 'Registro Comercial / Patente', icon: <Store className="w-4 h-4" />, requisitos: ['RNC y cédula', 'Comprobante de domicilio', 'Licencia sanitaria'], tasa: 'RD$ 500.00 anual' },
  { value: 'recoleccion_especial', label: 'Recolección Especial', icon: <Recycle className="w-4 h-4" />, requisitos: ['Cédula', 'Dirección de inmueble', 'Comprobante de residencia'], tasa: 'RD$ 800.00' },
];

export default function NuevoTramitePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-16">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-navy mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Portal
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#051429] rounded-xl flex items-center justify-center shadow-lg">
              <FileCheck className="w-6 h-6 text-[#E9D9AE]" />
            </div>
            <div>
              <h1 className="text-3xl font-sans font-black tracking-tight text-[#051429]">
                Información sobre Trámites Municipales
              </h1>
              <p className="text-gray-500 mt-1">
                Conozca los requisitos y procedimientos para cada tipo de trámite
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Cómo solicitar trámites</h2>
              <p className="text-blue-800">
                Todos los trámites municipales deben gestionarse presencialmente en las ventanillas del Ayuntamiento del Distrito Nacional. 
                A continuación encontrará información detallada sobre cada tipo de trámite disponible, incluyendo requisitos y tasas aplicables.
              </p>
            </div>
          </div>
        </div>

        {/* Service Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {TIPOS_TRAMITE.map(tramite => (
            <div key={tramite.value} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#051429] rounded-full flex items-center justify-center text-white">
                    {tramite.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#051429]">{tramite.label}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide">Requisitos:</h4>
                  <ul className="space-y-2">
                    {tramite.requisitos.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#B8902F] font-bold">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="font-bold text-sm text-gray-700 mb-1">Tasa Municipal:</p>
                  <p className="text-[#051429] font-bold text-base">{tramite.tasa}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#051429] mb-8">Información de Contacto</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Ubicación</h3>
                <p className="text-sm text-gray-600">
                  Ayuntamiento del Distrito Nacional<br/>
                  Avenida Máximo Gómez<br/>
                  Santo Domingo, República Dominicana
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Horario de Atención</h3>
                <p className="text-sm text-gray-600">
                  Lunes a Viernes<br/>
                  8:00 AM - 4:00 PM<br/>
                  Cerrado los feriados nacionales
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Teléfono</h3>
                <p className="text-sm text-gray-600">
                  +1 (809) 555-0100<br/>
                  Ext. Trámites: 1234<br/>
                  Disponible de lunes a viernes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12">
          <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Información Importante
          </h3>
          <ul className="space-y-3 text-sm text-amber-900">
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Se debe presentar solicitud presencialmente en las ventanillas del Ayuntamiento.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Los documentos deben presentarse en original y fotocopia.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">•</span>
              <span>El pago de tasas municipales se realiza en la ventanilla correspondiente.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Los tiempos de procesamiento varían según la complejidad del trámite.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0">•</span>
              <span>Se recomienda contactar con anticipación para consultas específicas.</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/servicios')}
            className="bg-[#051429] hover:bg-[#0a2244] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
          >
            Ver todos los servicios disponibles
          </button>
        </div>

      </div>
    </div>
  );
}