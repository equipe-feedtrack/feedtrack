// src/contexts/ProductContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from '../lib/api';
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  ativo: boolean;
  dataCriacao?: string;
  dataAtualizacao?: string;
  dataExclusao?: string | null;
}

export type NewProductData = {
  nome: string;
  descricao: string;
  valor: number;
};

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (productData: NewProductData) => Promise<Product | void>;
  updateProduct: (updatedProduct: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>; // Esta função agora desativa o produto
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/produtos');
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast({
          title: "Erro de Rede",
          description: "Não foi possível carregar os produtos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const addProduct = async (productData: NewProductData) => {
    try {
      const response = await api.post('/produto', productData);
      const newProduct = response.data;
      setProducts(current => [...current, newProduct]);
      toast({ title: "Sucesso", description: `Produto "${newProduct.nome}" adicionado!` });
      return newProduct;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      toast({ title: "Erro", description: "Não foi possível adicionar o produto.", variant: "destructive" });
    }
  };

  const updateProduct = async (productToUpdate: Product) => {
    try {
      // O payload para a API deve conter todos os campos que podem ser atualizados.
      const payload = {
        nome: productToUpdate.nome,
        descricao: productToUpdate.descricao,
        valor: productToUpdate.valor,
        ativo: productToUpdate.ativo,
        dataExclusao: productToUpdate.dataExclusao,
      };
      
      await api.put(`/atualizar-produto/${productToUpdate.id}`, payload);
      
      setProducts(current => 
        current.map(p => (p.id === productToUpdate.id ? productToUpdate : p))
      );
      // Evita mostrar toast de "atualizado" ao desativar/reativar
      if (productToUpdate.ativo === products.find(p => p.id === productToUpdate.id)?.ativo) {
         toast({ title: "Sucesso", description: "Produto atualizado com sucesso!" });
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast({ title: "Erro", description: "Não foi possível atualizar o produto.", variant: "destructive" });
    }
  };
  
  const deleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const deactivatedProduct: Product = {
      ...product,
      ativo: false,
      dataExclusao: new Date().toISOString(),
    };
    
    // Reutiliza a função de update para desativar
    await updateProduct(deactivatedProduct);
    toast({ title: "Produto Desativado", description: `"${product.nome}" foi movido para os inativos.` });
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used within a ProductProvider");
  return context;
};
