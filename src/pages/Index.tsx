import { DashboardStats } from "@/components/DashboardStats";
import { RecentFeedback } from "@/components/RecentFeedback";
import { CampaignPanel } from "@/components/CampaignPanel"; // Manter se ainda for usar em outro lugar
import { FeedbackForm } from "@/components/FeedbackForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BarChart3, Eye, Target, TrendingUp, FolderKanban } from "lucide-react"; // Adicionado TrendingUp e FolderKanban

// Componentes de gráfico existentes
import { CampaignResponseChart } from "@/components/CampaignResponseChart";
import { FeedbackDistributionChart } from "@/components/FeedbackDistributionChart";

// Nossos NOVOS componentes de gráfico
import { SatisfactionTrendChart } from "@/components/SatisfactionTrendChart";
import { FeedbackByCategoryChart } from "@/components/FeedbackByCategoryChart";

const Index = () => {
  return (
    <div className="space-y-6 mt-16 p-2">
      <div>
        <h1 className="text-3xl font-bold">Dashboard FeedTrack</h1>
        <p className="text-muted-foreground">
          Gerencie suas campanhas de feedback pós-venda e acompanhe a satisfação dos clientes
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Últimas Avaliações
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview Cliente
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <DashboardStats />
          {/* Primeira linha de gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignResponseChart />
            <FeedbackDistributionChart />
          </div>

          {/* Nova linha para os gráficos adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SatisfactionTrendChart />
            <FeedbackByCategoryChart />
          </div>

          {/* O card de Próximas Ações pode ser mantido aqui ou movido conforme preferência */}
          <div className="grid grid-cols-1 gap-6"> {/* Envolvi em uma nova div para manter a estrutura de grade */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Responder Feedback Negativo</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    3 avaliações com 2 estrelas ou menos precisam de atenção
                  </p>
                  <div className="text-xs text-warning">Prioridade: Alta</div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Campanha Semanal</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    89 novos clientes aguardando convite para avaliação
                  </p>
                  <div className="text-xs text-success">Prioridade: Média</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <RecentFeedback />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Experiência do Cliente</CardTitle>
              <p className="text-sm text-muted-foreground">
                Veja como os clientes visualizam o formulário de avaliação
              </p>
            </CardHeader>
            <CardContent className="bg-muted/30 p-6 rounded-lg">
              <FeedbackForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;