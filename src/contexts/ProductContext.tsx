// src/contexts/ProductContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Product = { id: number; name: string; category: string; price: number; };

interface ProductContextType {
  products: Product[];
  addProduct: (name: string, category: string, price: number) => Product;
  updateProduct: (updatedProduct: Product) => void; // 👈 NOVO
  deleteProduct: (id: number) => void;             // 👈 NOVO
  getProductById: (id: number) => Product | undefined;
}

const mockProducts: Product[] = [
  { id: 201, name: "Smartphone X", category: "Eletrônicos", price: 2999.90 },
  { id: 202, name: "Fone de Ouvido Y", category: "Acessórios", price: 399.00 },
  { id: 203, name: "Carregador Z", category: "Acessórios", price: 120.00 },
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const addProduct = (name: string, category: string, price: number): Product => {
    const newProduct: Product = { id: Math.random(), name, category, price };
    setProducts(current => [...current, newProduct]);
    return newProduct;
  };
  
  // 👇 NOVA FUNÇÃO DE ATUALIZAÇÃO
  const updateProduct = (updatedProduct: Product) => {
    setProducts(current => current.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  // 👇 NOVA FUNÇÃO DE EXCLUSÃO
  const deleteProduct = (id: number) => {
    setProducts(current => current.filter(p => p.id !== id));
  };
  
  const getProductById = (id: number) => products.find(p => p.id === id);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used within a ProductProvider");
  return context;
};