import { DashboardStats } from "@/components/DashboardStats";
import { RecentFeedback } from "@/components/RecentFeedback";
import { CampaignPanel } from "@/components/CampaignPanel";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BarChart3, Eye, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Campanhas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Campanha Black Friday</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    156 clientes • 142 mensagens enviadas • 89 respostas
                  </p>
                  <div className="text-xs text-success">Taxa de resposta: 62%</div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Feedback Pós-Compra</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    298 clientes • 298 mensagens enviadas • 187 respostas
                  </p>
                  <div className="text-xs text-success">Taxa de resposta: 63%</div>
                </div>
              </CardContent>
            </Card>
            
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
