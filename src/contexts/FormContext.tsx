// src/contexts/FormContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { Package, Users, Store, ShoppingCart } from "lucide-react";

export type FormSection = {
  id: string;
  title: string;
  icon: 'Package' | 'Users' | 'Store' | 'ShoppingCart';
  hasRating: boolean; // 👈 NOVO
  ratingPrompt: string;
  starLabels: { [key: number]: string };
  hasComment: boolean; // 👈 NOVO
  commentPrompt: string;
  commentPlaceholder: string;
};

// ... (interface FormContextType permanece a mesma por enquanto)

const initialSections: FormSection[] = [
  { id: 'product', title: 'Qualidade do Produto', icon: 'Package', hasRating: true, ratingPrompt: 'Como você avalia este produto?', starLabels: { 1: 'Péssimo', 2: 'Ruim', 3: 'Regular', 4: 'Bom', 5: 'Excelente' }, hasComment: true, commentPrompt: 'Comentários sobre o produto (opcional)', commentPlaceholder: 'Fale sobre a qualidade, funcionalidades, design...' },
  { id: 'service', title: 'Atendimento', icon: 'Users', hasRating: true, ratingPrompt: 'Como foi o atendimento da nossa equipe?', starLabels: { 1: 'Muito Ruim', 2: 'Ruim', 3: 'Regular', 4: 'Bom', 5: 'Ótimo' }, hasComment: true, commentPrompt: 'Comentários sobre o atendimento (opcional)', commentPlaceholder: 'Fale sobre a cordialidade, agilidade...' },
];

const FormContext = createContext<any | undefined>(undefined); // Simplificado para 'any'

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formSections, setFormSections] = useState<FormSection[]>(initialSections);

  const updateSection = (id: string, data: Partial<Omit<FormSection, 'id'>>) => {
    setFormSections(current => current.map(section =>
      section.id === id ? { ...section, ...data } : section
    ));
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: new Date().toISOString(), title: 'Nova Seção', icon: 'ShoppingCart', hasRating: true, ratingPrompt: 'Qual a sua avaliação?', starLabels: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }, hasComment: true, commentPrompt: 'Comentários (opcional)', commentPlaceholder: 'Deixe seu comentário...'
    };
    setFormSections(current => [...current, newSection]);
  };
  
  const deleteSection = (id: string) => {
    if (formSections.length <= 1) {
      toast({ title: "Ação inválida", description: "O formulário deve ter pelo menos uma seção.", variant: "destructive" });
      return;
    }
    setFormSections(current => current.filter(section => section.id !== id));
  };

  return (
    <FormContext.Provider value={{ formSections, updateSection, addSection, deleteSection }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): any => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useForm must be used within a FormProvider");
  return context;
};

export const iconMap: Record<string, React.ElementType> = { Package, Users, Store, ShoppingCart };