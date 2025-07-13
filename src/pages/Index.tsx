import { useState } from "react";
import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/DashboardStats";
import { RecentFeedback } from "@/components/RecentFeedback";
import { CampaignPanel } from "@/components/CampaignPanel";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BarChart3, Settings, Eye } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard FeedTrack</h2>
          <p className="text-muted-foreground">
            Gerencie suas campanhas de feedback pós-venda e acompanhe a satisfação dos clientes
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Campanhas
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preview Cliente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentFeedback />
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

          <TabsContent value="campaigns">
            <CampaignPanel />
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
    </div>
  );
};

export default Index;
