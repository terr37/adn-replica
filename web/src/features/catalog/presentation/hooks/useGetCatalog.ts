'use client';

import { useState, useEffect } from 'react';
import { TaxEntity } from '../../domain/TaxEntity';

const MOCK_CATALOG: TaxEntity[] = [
  {
    id: '1',
    title: 'Permisos de Construcción',
    description: 'Autorización para inicio de obras y modificaciones estructurales mayores.',
    price: 2500,
    iconName: 'Building2'
  },
  {
    id: '2',
    title: 'Recolección Especial',
    description: 'Servicio programado para escombros o residuos voluminosos.',
    price: 800,
    iconName: 'Recycle'
  },
  {
    id: '3',
    title: 'Uso de Espacio Público',
    description: 'Permisos temporales para eventos o actividades comerciales.',
    price: 1200,
    iconName: 'Tent'
  },
  {
    id: '4',
    title: 'Registro Comercial',
    description: 'Inscripción y renovación de patentes municipales para negocios.',
    price: 5000,
    iconName: 'Store'
  },
  { id: '5', title: 'Certificación de No Objeción', description: 'Documento para operaciones comerciales.', price: 1500, iconName: 'FileCheck' },
  { id: '6', title: 'Solicitud de Poda', description: 'Gestión para mantenimiento de árboles.', price: 300, iconName: 'Trees' },
  { id: '7', title: 'Placa de Numeración', description: 'Solicitud de numeración de inmuebles.', price: 450, iconName: 'MapPin' },
  { id: '8', title: 'Publicidad Exterior', description: 'Permisos para letreros y vallas.', price: 3000, iconName: 'Image' }
];

export const useGetCatalog = () => {
  const [data, setData] = useState<TaxEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setData(MOCK_CATALOG);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};
