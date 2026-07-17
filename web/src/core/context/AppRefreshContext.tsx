'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// ============================================================================
// AppRefreshContext
// Lightweight invalidation bus. Components subscribe to `paymentVersion` or
// `incidentVersion` as useEffect dependencies to auto-refetch when a mutation
// elsewhere in the app increments the version counter.
// ============================================================================

interface AppRefreshContextValue {
  /** Increments every time a payment is successfully processed. */
  paymentVersion: number;
  /** Increments every time an incident is successfully reported. */
  incidentVersion: number;
  /** Call from CheckoutModal after procesarFacturaPago() succeeds. */
  invalidatePayments: () => void;
  /** Call from IncidentMap after reportarIncidente() succeeds. */
  invalidateIncidents: () => void;
}

const AppRefreshContext = createContext<AppRefreshContextValue | null>(null);

export const AppRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentVersion, setPaymentVersion] = useState(0);
  const [incidentVersion, setIncidentVersion] = useState(0);

  const invalidatePayments = useCallback(() => {
    setPaymentVersion((v) => v + 1);
  }, []);

  const invalidateIncidents = useCallback(() => {
    setIncidentVersion((v) => v + 1);
  }, []);

  const value = useMemo<AppRefreshContextValue>(
    () => ({ paymentVersion, incidentVersion, invalidatePayments, invalidateIncidents }),
    [paymentVersion, incidentVersion, invalidatePayments, invalidateIncidents]
  );

  return (
    <AppRefreshContext.Provider value={value}>
      {children}
    </AppRefreshContext.Provider>
  );
};

/**
 * Hook to consume the AppRefreshContext.
 * Throws if used outside <AppRefreshProvider>.
 */
export const useAppRefresh = (): AppRefreshContextValue => {
  const ctx = useContext(AppRefreshContext);
  if (!ctx) {
    throw new Error('useAppRefresh must be used inside <AppRefreshProvider>');
  }
  return ctx;
};
