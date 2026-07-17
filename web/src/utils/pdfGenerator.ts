interface FilaTabla {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

export const generarDocumentoOficial = async (tituloDoc: string) => {
  // Importación dinámica para evitar fallos de SSR en Next.js
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Paleta de colores institucionales
  const navy = [5, 20, 41];      // #051429
  const gold = [184, 144, 47];   // #B8902F
  const darkGray = [60, 60, 60];
  const lightGray = [245, 247, 250];

  // --- ENCABEZADO CORPORATIVO ---
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 32, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AYUNTAMIENTO DEL DISTRITO NACIONAL', 15, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Oficina de Acceso a la Información (OAI) | Ley General de Libre Acceso 200-04', 15, 21);
  doc.text('República Dominicana', 15, 26);

  // --- TÍTULO Y METADATOS DEL REPORTE ---
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(tituloDoc.toUpperCase(), 15, 48);

  doc.setDrawColor(220, 224, 230);
  doc.setLineWidth(0.5);
  doc.line(15, 52, 195, 52);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Código de Control:', 15, 60);
  doc.text('Fecha de Emisión:', 15, 65);
  doc.text('Clasificación:', 15, 70);
  doc.text('Estado:', 15, 75);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('ADN-OAI-2026-0982', 50, 60);
  doc.text('13 de Julio de 2026', 50, 65);
  doc.text('Información Pública de Libre Acceso', 50, 70);

  doc.setTextColor(34, 139, 34);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRMADO Y PUBLICADO', 50, 75);

  // --- SELECCIÓN Y RENDERIZADO DE DATOS MOCK ---
  let cabecera: string[] = [];
  let filas: FilaTabla[] = [];

  if (tituloDoc.includes('Presupuesto') || tituloDoc.includes('Ejecución')) {
    cabecera = ['Sector de Inversión', 'Asignado (RD$)', 'Ejecutado (RD$)', 'Desviación'];
    filas = [
      { col1: 'Infraestructura Vial y Obras', col2: '450,000,000', col3: '387,000,000', col4: '-14.0%' },
      { col1: 'Aseo Urbano y Gestión Ambiental', col2: '280,000,000', col3: '265,000,000', col4: '-5.4%' },
      { col1: 'Desarrollo Social y Comunitario', col2: '120,000,000', col3: '98,000,000', col4: '-18.3%' },
      { col1: 'Administración General Interna', col2: '95,000,000', col3: '88,000,000', col4: '-7.4%' },
      { col1: 'Seguridad y Convivencia Ciudadana', col2: '75,000,000', col3: '62,000,000', col4: '-17.3%' }
    ];
  } else if (tituloDoc.includes('Nómina') || tituloDoc.includes('Sueldos')) {
    cabecera = ['Departamento', 'Plazas Activas', 'Rango Salarial (RD$)', 'Costo Mensual'];
    filas = [
      { col1: 'Dirección de Aseo Urbano', col2: '1,840', col3: '18,500 - 45,000', col4: '38,200,000' },
      { col1: 'Policía Municipal', col2: '650', col3: '22,000 - 55,000', col4: '17,800,000' },
      { col1: 'Obras Públicas y Equipos', col2: '420', col3: '25,000 - 85,000', col4: '14,500,000' },
      { col1: 'Administración y Planificación', col2: '310', col3: '30,000 - 120,000', col4: '12,900,000' },
      { col1: 'Tecnología de la Información', col2: '45', col3: '45,000 - 165,000', col4: '3,800,000' }
    ];
  } else {
    cabecera = ['Eje Estratégico', 'Meta Propuesta', 'Indicador Clave', 'Progreso Estimado'];
    filas = [
      { col1: 'Reconstrucción Peatonal', col2: '35 km aceras', col3: 'Metros lineales', col4: '81.4% Completado' },
      { col1: 'Puntos Verdes de Reciclaje', col2: '40 estaciones', col3: 'Unidades activas', col4: '80.0% Completado' },
      { col1: 'Digitalización de Trámites', col2: '100% en línea', col3: 'Servicios migrados', col4: '95.0% Completado' },
      { col1: 'Arborización de Avenidas', col2: '10,000 árboles', col3: 'Especímenes sembrados', col4: '82.0% Completado' }
    ];
  }

  // --- DIBUJAR TABLA ---
  let y = 88;
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(15, y, 180, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(cabecera[0], 18, y + 5.5);
  doc.text(cabecera[1], 80, y + 5.5);
  doc.text(cabecera[2], 125, y + 5.5);
  doc.text(cabecera[3], 170, y + 5.5);

  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  filas.forEach((row, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(15, y, 180, 8.5, 'F');
    }
    doc.text(row.col1, 18, y + 5.5);
    doc.text(row.col2, 80, y + 5.5);
    doc.text(row.col3, 125, y + 5.5);
    doc.text(row.col4, 170, y + 5.5);
    y += 8.5;
  });

  // --- CERTIFICACIÓN Y SELLO ---
  y += 15;
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(250, 250, 250);
  doc.rect(15, y, 180, 24, 'F');
  doc.rect(15, y, 180, 24, 'D');

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CERTIFICACIÓN DE TRANSPARENCIA:', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(7.5);
  doc.text('Este documento constituye una publicación oficial del Ayuntamiento del Distrito Nacional en cumplimiento', 18, y + 10);
  doc.text('con los estándares de Datos Abiertos de la Dirección General de Ética e Integridad Gubernamental (DIGEIG).', 18, y + 14);
  doc.text('Para validar la integridad de este reporte, puede escanear el código de barras oficial o consultar nuestro portal.', 18, y + 18);

  doc.setDrawColor(gold[0], gold[1], gold[2]);
  doc.setFillColor(255, 255, 255);
  doc.circle(172, y + 12, 8, 'FD');
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.text('OAI', 170, y + 11.5);
  doc.text('VALIDADOR', 164, y + 14);

  // --- PIE DE PÁGINA ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.text('Ayuntamiento del Distrito Nacional | Santo Domingo, D.N. | www.adn.gob.do', 15, 285);
  doc.text('Página 1 de 1', 180, 285);

  const nombreLimpio = tituloDoc.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`${nombreLimpio}.pdf`);
};