'use client';

import React, { useState, useEffect } from 'react';
import { useGetCatalog } from '../../features/catalog/presentation/hooks/useGetCatalog';
import { ArrowLeft, Search, Filter, FileText, CheckCircle, CreditCard, ShieldCheck, RefreshCw, UploadCloud, User, ArrowRight, FileCheck, Image as ImageIcon, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TaxEntity } from '../../features/catalog/domain/TaxEntity';

const CATEGORIES = ['Todos', 'Urbanismo', 'Aseo', 'Comercio', 'Espacios'];

const CATEGORY_MAP: Record<string, string> = {
  '1': 'Urbanismo', '2': 'Aseo', '3': 'Espacios', '4': 'Comercio',
  '5': 'Comercio', '6': 'Aseo', '7': 'Urbanismo', '8': 'Comercio',
  '9': 'Espacios', '10': 'Urbanismo', '11': 'Comercio', '12': 'Espacios',
};

const SERVICE_DETAILS: Record<string, { requisitos: string[]; canalAtencion: string; tasaInfo: string; montoNum: number }> = {
  '1': { requisitos: ['Copia de cédula o RNC', 'Planos arquitectónicos', 'Licencia municipal'], canalAtencion: 'Ventanilla única de Urbanismo o procesamiento exprés en línea.', tasaInfo: 'RD$ 4,500.00', montoNum: 4500 },
  '2': { requisitos: ['Copia de cédula', 'Comprobante de propiedad'], canalAtencion: 'Área de cajas o pago telemático directo.', tasaInfo: 'RD$ 300.00', montoNum: 300 },
  '3': { requisitos: ['Copia de cédula', 'Propuesta técnica de uso'], canalAtencion: 'Dirección de Espacios Públicos.', tasaInfo: 'RD$ 1,200.00', montoNum: 1200 },
  '4': { requisitos: ['Copia de RNC', 'Comprobante de domicilio comercial'], canalAtencion: 'Registro de Comercio y Patentes.', tasaInfo: 'RD$ 800.00', montoNum: 800 },
  '5': { requisitos: ['Copia de RNC', 'Registro sanitario'], canalAtencion: 'Ventanilla comercial.', tasaInfo: 'RD$ 1,500.00', montoNum: 1500 },
  '6': { requisitos: ['Copia de cédula', 'Dirección del inmueble'], canalAtencion: 'Ventanilla de Aseo Urbano.', tasaInfo: 'RD$ 800.00', montoNum: 800 },
  '7': { requisitos: ['Copia de cédula', 'Planos de referencia'], canalAtencion: 'Certificaciones de Planeamiento.', tasaInfo: 'RD$ 150.00', montoNum: 150 },
  '8': { requisitos: ['Copia de RNC', 'Licencia municipal'], canalAtencion: 'Publicidad Exterior.', tasaInfo: 'RD$ 2,000.00', montoNum: 2000 },
  '9': { requisitos: ['Cédula del organizador', 'Permiso de Interior y Policía'], canalAtencion: 'Permisología de eventos masivos.', tasaInfo: 'RD$ 2,500.00', montoNum: 2500 },
  '10': { requisitos: ['Título de propiedad', 'Cédula', 'Plano de mensura'], canalAtencion: 'Evaluación técnica urbana.', tasaInfo: 'RD$ 1,200.00', montoNum: 1200 },
  '11': { requisitos: ['RNC de la empresa', 'Certificación de fumigación'], canalAtencion: 'Servicios Públicos y Mercados.', tasaInfo: 'RD$ 3,100.00', montoNum: 3100 },
  '12': { requisitos: ['Copia de cédula', 'Acta de defunción oficial'], canalAtencion: 'Administración de Cementerios.', tasaInfo: 'RD$ 500.00', montoNum: 500 }
};

// ARREGLADO: Función auxiliar para mapear IDs dinámicos (e.g. 'svc-001' -> '1')
const normalizeId = (id: string): string => {
  if (id.startsWith('svc-')) {
    const num = parseInt(id.replace('svc-', ''), 10);
    return num.toString();
  }
  return id;
};

export default function ServiciosPage() {
  const router = useRouter();
  const { data: catalogData = [], isLoading } = useGetCatalog();
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedService, setSelectedService] = useState<TaxEntity | null>(null);

  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'documents' | 'form' | 'processing' | 'success'>('documents');

  const [taxpayerId, setTaxpayerId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const session = localStorage.getItem('userSession');
    if (session) {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      setTaxpayerId(parsedUser.cedula || parsedUser.rnc || '001-1847291-3');
    }
  }, []);

  const adicionales: TaxEntity[] = [
    { id: '9', title: 'Permiso para Eventos Masivos', description: 'Autorización y evaluación de seguridad para espectáculos artísticos o deportivos.', iconName: 'Calendar', price: 2000 },
    { id: '10', title: 'Evaluación de Uso de Suelo', description: 'Certificación técnica de compatibilidad urbanística para nuevos proyectos.', iconName: 'Map', price: 2000 },
    { id: '11', title: 'Arrendamiento en Mercados', description: 'Asignación y regularización de locales comerciales en mercados municipales.', iconName: 'Store', price: 2000 },
    { id: '12', title: 'Tasas de Inhumación', description: 'Servicios de asignación de nichos y registros de sepelios en camposantos.', iconName: 'Milestone', price: 2000 }
  ];

  const extendedCatalog = [...catalogData, ...adicionales];

  // ARREGLADO: uso de normalizeId para filtros por categoría
  const filteredData = extendedCatalog.filter(tax => {
    const matchesSearch = tax.title.toLowerCase().includes(filter.toLowerCase()) || tax.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || CATEGORY_MAP[normalizeId(tax.id)] === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // ARREGLADO: uso de normalizeId para cargar el detalle del servicio
  const serviceDetail = selectedService ? SERVICE_DETAILS[normalizeId(selectedService.id)] : null;

  const handleInitiatePayment = () => {
    if (!user) {
      router.push('/login');
    } else {
      setPaymentStep('documents');
      setUploadedFiles({});
      setShowCheckoutModal(true);
    }
  };

  const handleDocumentsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todosCargados = serviceDetail?.requisitos.every(req => uploadedFiles[req]) ?? false;
    if (!todosCargados) {
      alert('Por favor, adjunte todas las imágenes o documentos obligatorios exigidos por Caja.');
      return;
    }
    setPaymentStep('form');
  };

  const handleMockPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
    }, 2500);
  };

  const toggleFileUploadSimulate = (requisito: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [requisito]: !prev[requisito]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <RefreshCw className="w-10 h-10 text-[#051429] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {!selectedService ? (
          <>
            <div className="mb-10">
              <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#051429] mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Portal
              </Link>
              <h1 className="text-4xl font-sans font-black tracking-tight text-[#051429] mb-3">
                Catálogo de Servicios Municipales
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl">
                Consulte requisitos, radique su documentación obligatoria y efectúe pagos digitales de forma integrada.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Buscar servicio municipal..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:ring-2 focus:ring-[#B8902F]/30 focus:border-[#B8902F] outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-400" />
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${activeCategory === cat ? 'bg-[#051429] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredData.map(tax => {
                const IconComponent = (Icons as any)[tax.iconName] || Icons.FileText;
                return (
                  <button
                    key={tax.id}
                    onClick={() => setSelectedService(tax)}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 flex flex-col h-full group text-left transition-all"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:text-[#B8902F] group-hover:bg-[#B8902F]/5">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-[#051429] mb-2 line-clamp-2">{tax.title}</h3>
                    <p className="text-xs text-gray-500 mb-6 flex-1 line-clamp-3">{tax.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 w-full">
                      <span className="font-bold text-[#B8902F] text-xs uppercase tracking-wider">Tramitar Online</span>
                      <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400 group-hover:text-[#B8902F]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedService(null)} className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#051429] mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Catálogo
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#051429] to-[#0a2f5a] p-8 sm:p-12 text-white">
                {/* ARREGLADO: uso de normalizeId para la insignia de la categoría */}
                <span className="bg-[#B8902F] text-[#051429] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                  {CATEGORY_MAP[normalizeId(selectedService.id)]}
                </span>
                <h1 className="text-3xl text-white font-black mt-3">{selectedService.title}</h1>
                <p className="text-white/80 text-sm mt-2 font-normal">{selectedService.description}</p>
              </div>

              {serviceDetail && (
                <div className="p-8 sm:p-12 space-y-8">
                  <div className="bg-gradient-to-br from-amber-50/40 to-amber-50 rounded-2xl p-6 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                      <span className="text-xs text-amber-800 font-bold uppercase tracking-wider">Costo del Arbitrio</span>
                      <p className="text-3xl font-black text-[#051429]">{serviceDetail.tasaInfo}</p>
                    </div>
                    <button
                      onClick={handleInitiatePayment}
                      className="bg-[#051429] hover:bg-[#B8902F] text-white font-bold text-sm px-6 py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
                    >
                      <FileText className="w-4 h-4 text-[#E9D9AE]" />
                      Iniciar Trámite y Pago
                    </button>
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#051429] mb-3 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#B8902F]" /> Documentación Requerida
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">Usted deberá cargar copias legibles de estos documentos en el siguiente paso.</p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                      <ul className="space-y-2">
                        {serviceDetail.requisitos.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                            <CheckCircle className="w-3.5 h-3.5 text-[#B8902F]" /> {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showCheckoutModal && selectedService && serviceDetail && isMounted && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

              {paymentStep === 'documents' && (
                <form onSubmit={handleDocumentsSubmit}>
                  <div className="bg-[#051429] p-6 text-white">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-[#B8902F]" />
                      <div>
                        <h3 className="font-black text-lg text-white m-0 p-0 block leading-tight">Paso 1: Radicación de Datos</h3>
                        <p className="text-[11px] text-white/60 mt-0.5">Expediente Digital Tributario</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 font-medium">
                      Los documentos e identidad adjuntos serán verificados manualmente por el personal fiscalizador de **Caja**.
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" /> Identificación del Contribuyente
                        </label>
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                          <Lock className="w-2.5 h-2.5" /> Vinculado a la Sesión
                        </span>
                      </div>
                      <input
                        type="text"
                        disabled
                        value={taxpayerId}
                        className="w-full bg-slate-100 border border-gray-200 rounded-xl p-3 text-sm font-mono font-bold text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                        Adjuntar Documentos Requeridos
                      </label>
                      <div className="space-y-3.5">
                        {serviceDetail.requisitos.map((req, idx) => (
                          <div key={idx} className="space-y-1">
                            <span className="text-xs font-bold text-gray-700">{req}</span>
                            <div
                              onClick={() => toggleFileUploadSimulate(req)}
                              className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${uploadedFiles[req]
                                ? 'border-emerald-400 bg-emerald-50/40'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-300'
                                }`}
                            >
                              {uploadedFiles[req] ? (
                                <div className="flex flex-col items-center gap-1.5 animate-in fade-in duration-200">
                                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-bold text-emerald-900 truncate max-w-[240px]">
                                    {req.toLowerCase().replace(/ /g, '_')}_adjunto.png
                                  </span>
                                  <span className="text-[10px] text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full font-extrabold tracking-wide uppercase">
                                    Imagen Cargada con éxito
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <UploadCloud className="w-7 h-7 text-slate-400" />
                                  <p className="text-xs font-semibold text-slate-600">
                                    Presione para cargar o arrastrar captura
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-medium">Formatos admitidos: JPG, PNG, PDF hasta 5MB</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button type="button" onClick={() => setShowCheckoutModal(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                        Cancelar
                      </button>
                      <button type="submit" className="flex-1 py-3.5 bg-[#051429] text-white rounded-xl font-bold text-sm hover:bg-[#051429]/90 transition-all flex items-center justify-center gap-2">
                        Continuar al Pago <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {paymentStep === 'form' && (
                <form onSubmit={handleMockPayment}>
                  <div className="bg-[#051429] p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-[#B8902F]" />
                      <div>
                        <h3 className="font-black text-lg text-white">Paso 2: Pasarela Bancaria</h3>
                        <p className="text-[11px] text-white/60">ADN Transacciones Seguras</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-400 font-bold block uppercase">Total</span>
                      <span className="text-xl font-black">{serviceDetail.tasaInfo}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-bold text-[#051429] space-y-1">
                      <div className="flex justify-between">
                        <span>Concepto:</span>
                        <span className="text-slate-600 font-medium truncate max-w-[75%]">{selectedService.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Doc. Contribuyente (Sesión):</span>
                        <span className="text-slate-600 font-mono font-medium">{taxpayerId}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nombre en la Tarjeta</label>
                      <input type="text" required placeholder="JUAN PEREZ" className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[#B8902F] outline-none uppercase font-semibold" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Número de Tarjeta</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text" required maxLength={19} placeholder="4000 1234 5678 9010" value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[#B8902F] outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Expiración</label>
                        <input
                          type="text" required maxLength={5} placeholder="MM/AA" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[#B8902F] outline-none text-center font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">CVC / CVV</label>
                        <input
                          type="password" required maxLength={4} placeholder="123" value={cardCvc} onChange={e => setCardCvc(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[#B8902F] outline-none text-center font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setPaymentStep('documents')} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                        Atrás
                      </button>
                      <button type="submit" className="flex-1 py-3.5 bg-[#B8902F] text-[#051429] rounded-xl font-black text-sm hover:bg-[#051429] hover:text-white transition-all shadow-md">
                        Confirmar Pago
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {paymentStep === 'processing' && (
                <div className="p-12 text-center space-y-6">
                  <RefreshCw className="w-16 h-16 text-[#B8902F] mx-auto animate-spin" />
                  <div>
                    <h4 className="text-xl font-black text-[#051429]">Empaquetando Trámite Financiero</h4>
                    <p className="text-xs text-slate-400 mt-2">Cifrando las imágenes adjuntas y procesando cobro bancario. Despachando paquete consolidado a las colas de auditoría de Caja...</p>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>

                  <div>
                    <h4 className="text-2xl font-black text-[#051429]">¡Transacción Recibida!</h4>
                    <p className="text-xs text-amber-600 font-bold mt-1 uppercase tracking-wider bg-amber-50 border border-amber-200 py-1 px-3 rounded-full inline-block">
                      Pendiente de Validación por Caja
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left font-mono text-xs text-slate-600 space-y-2">
                    <p className="border-b border-dashed border-slate-300 pb-2 text-center text-slate-800 font-bold">RADICACIÓN MUNICIPAL DE CAJA</p>
                    <p><span className="font-bold">Trámite ID:</span> #ADN-{Math.floor(Math.random() * 900000 + 100000)}</p>
                    <p><span className="font-bold">Contribuyente:</span> {user?.name || 'Usuario Registrado'}</p>
                    <p><span className="font-bold">Cédula/RNC:</span> {taxpayerId}</p>
                    <p><span className="font-bold">Arbitrio:</span> {selectedService.title}</p>
                    <p><span className="font-bold">Monto Transacción:</span> {serviceDetail.tasaInfo}</p>
                    <p>
                      <span className="font-bold">Expedientes:</span>{' '}
                      <span className="text-emerald-600 font-sans font-bold">({serviceDetail.requisitos.length}/{serviceDetail.requisitos.length}) Imágenes validadas</span>
                    </p>
                    <p><span className="font-bold">Fecha Envío:</span> {new Date().toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 text-center pt-3 leading-relaxed border-t border-slate-200 mt-2">
                      Las imágenes adjuntas y el comprobante bancario han sido consolidados de forma segura. Un auditor del departamento de Caja validará la legitimidad de los depósitos en un plazo de 24-48 horas laborables.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setSelectedService(null);
                    }}
                    className="w-full py-3.5 bg-[#051429] text-white rounded-xl font-bold text-sm hover:bg-[#B8902F] transition-colors"
                  >
                    Finalizar y Volver al Catálogo
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}