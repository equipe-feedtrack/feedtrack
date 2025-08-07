// src/contexts/FormContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from '../lib/api';
import { useToast } from "@/hooks/use-toast";

// Interfaces
export interface Pergunta {
  id: string;
  texto: string;
  tipo: 'nota' | 'texto' | 'multipla_escolha';
  opcoes?: string[];
  ativo?: boolean;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface Formulario {
  id: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  perguntas: Pergunta[];
}

export type NewQuestionData = Omit<Pergunta, 'id' | 'ativo' | 'dataCriacao' | 'dataAtualizacao'>;

// <<< ALTERADO: Renomeado para refletir tanto criação quanto atualização
export type FormPayload = {
  titulo: string;
  descricao: string;
  idsPerguntas: string[];
};

interface FormContextType {
  formularios: Formulario[];
  perguntas: Pergunta[];
  loading: boolean;
  getFormById: (formId: string) => Promise<Formulario | void>; // <<< NOVO
  addForm: (formData: FormPayload) => Promise<Formulario | void>;
  addQuestion: (questionData: NewQuestionData) => Promise<Pergunta | void>;
  // <<< NOVO: Funções adicionadas ao tipo
  deleteForm: (formId: string) => Promise<void>;
  updateForm: (formId: string, updatedData: Partial<FormPayload>) => Promise<Formulario | void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [formsRes, questionsRes] = await Promise.all([
          api.get('/formularios'),
          api.get('/perguntas')
        ]);
        setFormularios(formsRes.data);
        setPerguntas(questionsRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast({ title: "Erro de Rede", description: "Não foi possível carregar os dados.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

    // <<< NOVO: Implementação da rota GET /formulario/{id} >>>
  const getFormById = async (formId: string) => {
    try {
      const response = await api.get(`/formulario/${formId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar formulário ${formId}:`, error);
      toast({ title: "Erro", description: "Não foi possível carregar os detalhes do formulário.", variant: "destructive" });
    }
  };

  const addForm = async (formData: FormPayload) => {
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

  // <<< ATUALIZADO: Implementação da rota DELETE /delete-formulario/{id} >>>
  const deleteForm = async (formId: string) => {
    try {
      // Endpoint ajustado para corresponder à sua documentação
      // A API retorna 204 No Content, então não há `response.data`
      await api.delete(`/delete-formulario/${formId}`);

      // Apenas removemos do estado local após o sucesso da requisição
      setFormularios(current => current.filter(form => form.id !== formId));
      toast({ title: "Sucesso", description: "Formulário excluído com sucesso!" });
    }
    catch (error) {
      console.error("Erro ao excluir formulário:", error);
      toast({ title: "Erro", description: "Não foi possível excluir o formulário.", variant: "destructive" });
    }
  };
  

  const updateForm = async (formId: string, updatedData: Partial<FormPayload>) => {
    try {
      // Endpoint ajustado para corresponder à sua documentação
      const response = await api.put(`/update-formulario/${formId}`, updatedData);
      const updatedForm = response.data;

      // Atualiza o estado local com os dados retornados pela API
      setFormularios(current => current.map(form => (form.id === formId ? updatedForm : form)));
      toast({ title: "Sucesso", description: "Formulário atualizado com sucesso!" });
      return updatedForm;
    } catch (error) {
      console.error("Erro ao atualizar formulário:", error);
      toast({ title: "Erro", description: "Não foi possível atualizar o formulário.", variant: "destructive" });
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
    // <<< NOVO: Funções adicionadas ao contexto
    <FormContext.Provider value={{ formularios, perguntas, loading, getFormById, addForm, addQuestion, deleteForm, updateForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useForm must be used within a FormProvider");
  return context;
};