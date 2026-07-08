'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useToast } from '../components/Toast';

export interface CartItem {
  id: string;
  serviceName: string;
  price: number;
  reference: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  getTotal: () => 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  const addItem = useCallback((itemData: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...itemData,
      id: Math.random().toString(36).substring(2, 9),
    };
    setItems(prev => [...prev, newItem]);
    showToast(`"${itemData.serviceName}" añadido a su solicitud`, 'success');
  }, [showToast]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{ 
      items, 
      itemCount: items.length, 
      isCartOpen,
      setIsCartOpen,
      addItem, 
      removeItem, 
      clearCart, 
      getTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};
