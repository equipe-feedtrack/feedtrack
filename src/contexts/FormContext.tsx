// src/contexts/FormContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from '../lib/api';
import { useToast } from "@/hooks/use-toast";

// Interfaces baseadas na sua API
export interface Pergunta {
  id: string;
  texto: string;
  tipo: 'nota' | 'texto' | 'multipla_escolha';
  opcoes?: string[];
  ativo?: boolean; // <<< NOVO
  dataCriacao?: string; // <<< NOVO
  dataAtualizacao?: string; // <<< NOVO
}

export interface Formulario {
  id: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  perguntas: Pergunta[];
}

export type NewQuestionData = Omit<Pergunta, 'id' | 'ativo' | 'dataCriacao' | 'dataAtualizacao'>;
export type NewFormData = {
  titulo: string;
  descricao: string;
  idsPerguntas: string[];
};

interface FormContextType {
  formularios: Formulario[];
  perguntas: Pergunta[];
  loading: boolean;
  addForm: (formData: NewFormData) => Promise<Formulario | void>;
  addQuestion: (questionData: NewQuestionData) => Promise<Pergunta | void>;
  // Adicione aqui outras funções como update/delete se necessário
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Efeito para carregar formulários e perguntas da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Assumindo que existem rotas para listar todos os formulários e perguntas
        const [formsRes, questionsRes] = await Promise.all([
          api.get('/formularios'),
          api.get('/perguntas') // Nota: Esta rota '/perguntas' é uma suposição baseada na sua necessidade.
        ]);
        setFormularios(formsRes.data);
        setPerguntas(questionsRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados de formulários:", error);
        toast({
          title: "Erro de Rede",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const addForm = async (formData: NewFormData) => {
    try {
      const response = await api.post('/formulario', formData);
      const newForm = response.data;
      setFormularios(current => [...current, newForm]);
      toast({ title: "Sucesso", description: "Formulário criado com sucesso!" });
      return newForm;
    } catch (error) {
      console.error("Erro ao criar formulário:", error);
      toast({ title: "Erro", description: "Não foi possível criar o formulário.", variant: "destructive" });
    }
  };

  const addQuestion = async (questionData: NewQuestionData) => {
    try {
      const response = await api.post('/pergunta', questionData);
      const newQuestion = response.data;
      setPerguntas(current => [...current, newQuestion]);
      toast({ title: "Sucesso", description: "Nova pergunta adicionada!" });
      return newQuestion;
    } catch (error) {
      console.error("Erro ao criar pergunta:", error);
      toast({ title: "Erro", description: "Não foi possível criar a pergunta.", variant: "destructive" });
    }
  };

  return (
    <FormContext.Provider value={{ formularios, perguntas, loading, addForm, addQuestion }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useForm must be used within a FormProvider");
  return context;
};
