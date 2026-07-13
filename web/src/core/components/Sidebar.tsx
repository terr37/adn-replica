import React from 'react';
import { LayoutDashboard, FileText, Download, Eye, FileBox, Settings } from 'lucide-react';
import { cn } from '../utils';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: FileText, label: 'Trámites' },
    { icon: Download, label: 'Descargas' },
    { icon: Eye, label: 'Visualizar' },
    { icon: FileBox, label: 'Documentos' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-gray-100 flex flex-col items-center lg:items-start py-6 h-screen sticky top-0 shrink-0 shadow-soft z-10">
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto lg:ml-8 mb-10 shadow-soft">
        SD
      </div>
      
      <nav className="flex-1 w-full flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center justify-center lg:justify-start px-0 lg:px-8 py-3 text-gray-500 hover:text-primary transition-colors",
              item.active && "text-primary border-r-4 border-primary bg-primary/5"
            )}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden lg:block ml-4 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="w-full flex justify-center lg:justify-start lg:px-8 mt-auto pt-6 border-t border-gray-100">
        <button className="text-gray-500 hover:text-primary transition-colors flex items-center">
          <Settings className="w-5 h-5" />
          <span className="hidden lg:block ml-4 font-medium">Configuración</span>
        </button>
      </div>
    </aside>
  );
};
