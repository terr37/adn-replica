import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BrandCarousel } from './BrandCarousel';
import { ToastProvider } from './Toast';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen w-full bg-background relative">
        <Header />
        <main className="w-full flex-1 flex flex-col">
          {children}
          <BrandCarousel />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
};
