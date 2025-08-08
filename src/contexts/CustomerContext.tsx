import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from '../lib/api';
import { useToast } from "@/hooks/use-toast";
import { Product } from "./ProductContext";

// --- INTERFACES ---
export interface Pessoa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

export interface Customer {
  id: string;
  pessoa: Pessoa;
  cidade: string;
  vendedorResponsavel: string;
  status: string;
  produtos: Product[];
  dataCriacao?: string;
  dataAtualizacao?: string;
  dataExclusao?: string | null;
}

export type NewCustomerData = {
  pessoa: {
    nome: string;
    email: string;
    telefone: string;
  };
  cidade: string;
  vendedorResponsavel: string;
  idsProdutos: string[];
};

// --- NOVO: Tipo para a função de gestão de produtos ---
interface ManageProductsPayload {
    idsProdutosParaAdicionar?: string[];
    idsProdutosParaRemover?: string[];
}

// --- CONTEXT TYPE ---
interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  addCustomer: (newCustomerData: NewCustomerData) => Promise<Customer | void>;
  updateCustomer: (updatedCustomer: Omit<Customer, 'produtos'>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  // Nova função para gerir produtos
  manageCustomerProducts: (customerId: string, payload: ManageProductsPayload) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clientes');
      setCustomers(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast({
        title: "Erro de Rede",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [toast]);

  const addCustomer = async (data: NewCustomerData) => {
    try {
      const response = await api.post('/cliente', data); 
      const newCustomer = response.data;
      // Atualiza o estado local para uma UI reativa
      setCustomers(current => [...current, newCustomer]);
      toast({ title: "Sucesso", description: "Cliente adicionado com sucesso!" });
      return newCustomer;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast({ title: "Erro ao Adicionar", description: "Não foi possível criar o cliente.", variant: "destructive" });
    }
  };

  // Função de update volta a ser focada apenas nos dados do cliente
  const updateCustomer = async (updatedCustomer: Omit<Customer, 'produtos'>) => {
    try {
      const payload = {
        pessoa: updatedCustomer.pessoa,
        cidade: updatedCustomer.cidade,
        vendedorResponsavel: updatedCustomer.vendedorResponsavel,
        status: updatedCustomer.status,
      };
      await api.put(`/atualizar-cliente/${updatedCustomer.id}`, payload);
      // Após o sucesso, busca os clientes para garantir consistência
      await fetchCustomers();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({ title: "Erro ao Atualizar", description: "Não foi possível salvar as alterações.", variant: "destructive" });
      throw error;
    }
  };
  
  const deleteCustomer = async (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    
    // Para desativar, usamos a função de update normal
    const deactivatedCustomer = { ...customer, status: 'INATIVO' };
    
    try {
      await updateCustomer(deactivatedCustomer);
      toast({ title: "Sucesso", description: `Cliente "${customer.pessoa.nome}" foi desativado.` });
    } catch (error) {
      // O erro já é tratado pela função updateCustomer
    }
  };

  // <<< NOVO: Função para gerir produtos (adicionar/remover)
  const manageCustomerProducts = async (customerId: string, payload: ManageProductsPayload) => {
    try {
        await api.post(`/${customerId}/produtos`, payload);
        toast({ title: "Sucesso!", description: "Produtos do cliente foram atualizados." });
        // Após a operação, busca novamente a lista de clientes para garantir que os dados estão sincronizados
        await fetchCustomers(); 
    } catch (error) {
        console.error("Erro ao gerir produtos do cliente:", error);
        toast({
            title: "Erro na Operação",
            description: "Não foi possível concluir a operação com os produtos.",
            variant: "destructive",
        });
        throw error;
    }
  };

  return (
    <CustomerContext.Provider value={{ customers, loading, addCustomer, updateCustomer, deleteCustomer, manageCustomerProducts }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) throw new Error("useCustomer must be used within a CustomerProvider");
  return context;
};
