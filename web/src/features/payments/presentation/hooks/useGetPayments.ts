'use client';

import { useState, useEffect } from 'react';
import { PaymentEntity } from '../../domain/PaymentEntity';

const MOCK_PAYMENTS: PaymentEntity[] = [
  {
    id: '1',
    referenceId: '40223-A2012',
    title: 'Renovación Patente Comercial',
    date: '12/10/2023',
    progress: 40,
    status: 'En Revisión',
    type: 'document'
  },
  {
    id: '2',
    referenceId: 'A00122',
    title: 'Reporte Bacheo C/ Hostos',
    date: '05/10/2023',
    progress: 70,
    status: 'Programado',
    type: 'vehicle'
  },
  {
    id: '3',
    referenceId: 'Falta documentación',
    title: 'Permiso Poda de Árbol',
    date: '02/10/2023',
    progress: 25,
    status: 'Requiere acción',
    type: 'alert'
  }
];

export const useGetPayments = () => {
  const [data, setData] = useState<PaymentEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_PAYMENTS);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};
