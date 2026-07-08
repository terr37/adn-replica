import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { TaxEntity } from '../../domain/TaxEntity';
import * as Icons from 'lucide-react';

interface TaxCardProps {
  tax: TaxEntity;
}

export const TaxCard: React.FC<TaxCardProps> = ({ tax }) => {
  // Dynamically resolve icon from lucide-react, fallback to FileText
  const IconComponent = (Icons as any)[tax.iconName] || Icons.FileText;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 ease-out border border-gray-50 flex flex-col h-full group hover:-translate-y-2">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
        <IconComponent className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-semibold text-navy mb-2 leading-tight">
        {tax.title}
      </h3>

      <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3">
        {tax.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <span className="font-bold text-navy font-mono">
          RD$ {tax.price.toLocaleString('es-DO')}
        </span>
        <button className="text-gray-400 hover:text-primary transition-colors">
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
