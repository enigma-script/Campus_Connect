import React, { createContext, useContext, useState, useCallback } from 'react';

export type Page =
  | 'home'
  | 'events'
  | 'event-detail'
  | 'admin'
  | 'admin-event-form'
  | 'my-registrations'
  | 'auth';

interface RouterContextValue {
  currentPage: Page;
  params: Record<string, string>;
  navigate: (page: Page, params?: Record<string, string>) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [params, setParams] = useState<Record<string, string>>({});

  const navigate = useCallback((page: Page, newParams?: Record<string, string>) => {
    setCurrentPage(page);
    setParams(newParams ?? {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <RouterContext.Provider value={{ currentPage, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
