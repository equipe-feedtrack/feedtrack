// src/contexts/CustomerContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

// O tipo 'Customer' deve ser o que você definiu na sua página
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  lastPurchase: string;
  totalPurchases: number;
  status: "active" | "inactive";
  segment: "premium" | "regular" | "new";
}

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (newCustomerData: Omit<Customer, 'id' | 'registrationDate' | 'lastPurchase' | 'totalPurchases' | 'status'>) => Customer;
  updateCustomer: (updatedCustomer: Customer) => void;
  deleteCustomer: (id: number) => void;
  getCustomerById: (id: number) => Customer | undefined;
}

// O mock inicial deve usar a sua estrutura completa
const initialCustomers: Customer[] = [
    { id: 1, name: "Maria Silva", email: "maria.silva@email.com", phone: "(11) 99999-1111", address: "São Paulo, SP", registrationDate: "2024-01-15", lastPurchase: "2024-11-10", totalPurchases: 5, status: "active", segment: "premium" },
    { id: 2, name: "João Santos", email: "joao.santos@email.com", phone: "(11) 99999-2222", address: "Rio de Janeiro, RJ", registrationDate: "2024-03-20", lastPurchase: "2024-11-08", totalPurchases: 3, status: "active", segment: "regular" },
    { id: 3, name: "Ana Costa", email: "ana.costa@email.com", phone: "(11) 99999-3333", address: "Belo Horizonte, MG", registrationDate: "2024-11-01", lastPurchase: "2024-11-05", totalPurchases: 1, status: "active", segment: "new" },
];

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const addCustomer = (data: Omit<Customer, 'id' | 'registrationDate' | 'lastPurchase' | 'totalPurchases' | 'status'>) => {
    const newCustomer: Customer = {
      id: Math.max(0, ...customers.map(c => c.id)) + 1,
      ...data,
      registrationDate: new Date().toISOString().split('T')[0],
      lastPurchase: "",
      totalPurchases: 0,
      status: "active",
    };
    setCustomers(current => [...current, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(current => current.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
  
  const deleteCustomer = (id: number) => {
    setCustomers(current => current.filter(c => c.id !== id));
  };
  
  const getCustomerById = (id: number) => customers.find(c => c.id === id);

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer, getCustomerById }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) throw new Error("useCustomer must be used within a CustomerProvider");
  return context;
};