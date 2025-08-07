// src/contexts/CampaignContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from '../lib/api';
import { useToast } from "@/hooks/use-toast";

// Interface baseada na sua API de Campanhas
export interface Campanha {
  id: string;
  titulo: string;
  descricao: string;
  tipoCampanha: string;
  segmentoAlvo: string;
  dataInicio: string;
  dataFim: string;
  templateMensagem: string;
  formularioId: string;
  ativo: boolean;
}

export type NewCampaignData = Omit<Campanha, 'id' | 'ativo'>;

interface CampaignContextType {
  campaigns: Campanha[];
  loading: boolean;
  addCampaign: (campaignData: NewCampaignData) => Promise<Campanha | void>;
  updateCampaign: (campaignId: string, campaignData: Partial<NewCampaignData & { ativo: boolean }>) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  fetchCampaigns: () => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/campanhas');
      setCampaigns(response.data);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
      toast({
        title: "Erro de Rede",
        description: "Não foi possível carregar as campanhas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const addCampaign = async (campaignData: NewCampaignData) => {
    try {
      const response = await api.post('/campanha', campaignData);
      const newCampaign = response.data;
      await fetchCampaigns(); // Recarrega a lista para incluir a nova campanha
      toast({ title: "Sucesso", description: "Campanha criada com sucesso!" });
      return newCampaign;
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      toast({ title: "Erro", description: "Não foi possível criar a campanha.", variant: "destructive" });
    }
  };

  const updateCampaign = async (campaignId: string, campaignData: Partial<NewCampaignData & { ativo: boolean }>) => {
    // Encontra a campanha atual no estado para usar como base
    const campaignToUpdate = campaigns.find(c => c.id === campaignId);
    if (!campaignToUpdate) {
        toast({ title: "Erro", description: "Campanha não encontrada para atualizar.", variant: "destructive" });
        return;
    }

    // Combina os dados existentes com as novas alterações
    const updatedLocalCampaign = { ...campaignToUpdate, ...campaignData };

    try {
      // <<< CORRIGIDO: Cria um payload limpo com todos os campos editáveis,
      // garantindo que a API receba o objeto completo que espera.
      const payload = {
        titulo: updatedLocalCampaign.titulo,
        descricao: updatedLocalCampaign.descricao,
        tipoCampanha: updatedLocalCampaign.tipoCampanha,
        segmentoAlvo: updatedLocalCampaign.segmentoAlvo,
        dataInicio: updatedLocalCampaign.dataInicio,
        dataFim: updatedLocalCampaign.dataFim,
        templateMensagem: updatedLocalCampaign.templateMensagem,
        formularioId: updatedLocalCampaign.formularioId,
        ativo: updatedLocalCampaign.ativo,
      };

      await api.put(`/atualizar-campanha/${campaignId}`, payload);
      
      // Atualiza o estado local para uma resposta visual imediata
      setCampaigns(current => current.map(c => c.id === campaignId ? updatedLocalCampaign : c));
      
      toast({ title: "Sucesso", description: "Campanha atualizada." });
    } catch (error) {
      console.error("Erro ao atualizar campanha:", error);
      toast({ title: "Erro", description: "Não foi possível atualizar a campanha.", variant: "destructive" });
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      // A rota DELETE é para exclusão lógica (desativar)
      await api.delete(`/deletar-campanha/${campaignId}`);
      // Atualiza o estado local para refletir a mudança
      setCampaigns(current => current.map(c => c.id === campaignId ? { ...c, ativo: false } : c));
      toast({ title: "Sucesso", description: "Campanha desativada." });
    } catch (error) {
      console.error("Erro ao desativar campanha:", error);
      toast({ title: "Erro", description: "Não foi possível desativar a campanha.", variant: "destructive" });
    }
  };

  return (
    <CampaignContext.Provider value={{ campaigns, loading, addCampaign, updateCampaign, deleteCampaign, fetchCampaigns }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = (): CampaignContextType => {
  const context = useContext(CampaignContext);
  if (!context) throw new Error("useCampaign must be used within a CampaignProvider");
  return context;
};
