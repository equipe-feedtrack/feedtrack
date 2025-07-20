import { DashboardStats } from "@/components/DashboardStats";
import { RecentFeedback } from "@/components/RecentFeedback";
import { CampaignPanel } from "@/components/CampaignPanel";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, BarChart3, Eye, Users, TrendingUp, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

// Componentes de gráfico existentes
import { CampaignResponseChart } from "@/components/CampaignResponseChart";
import { FeedbackDistributionChart } from "@/components/FeedbackDistributionChart";

// Nossos NOVOS componentes de gráfico
import { SatisfactionTrendChart } from "@/components/SatisfactionTrendChart";
import { FeedbackByCategoryChart } from "@/components/FeedbackByCategoryChart";

const Index = () => {
  const { isAdmin, isEmployee, user } = useAuth();

  // Funcionários são redirecionados para suas funções principais

if (isEmployee) {
  return (
    <div className="space-y-6 mt-16 p-2">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}!</h1>
        <p className="text-muted-foreground">Acesse as funcionalidades disponíveis para funcionários</p>
      </div>
      
      {/* O grid agora suporta até 3 colunas em telas maiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle>Gerenciar Clientes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cadastre e gerencie informações dos clientes da empresa.
            </p>
            <Link to="/customers">
              <Button className="w-full">
                Acessar Clientes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <CardTitle>Criar Campanhas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Crie e configure novas campanhas de feedback para os produtos.
            </p>
            <Link to="/campaigns">
              <Button className="w-full">
                Acessar Campanhas
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 👇 NOVO CARD ADICIONADO AQUI 👇 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              {/* Usando o ícone Star que definimos para feedbacks */}
              <Star className="w-5 h-5 text-primary" />
              <CardTitle>Gerenciar Feedbacks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Visualize e adicione feedbacks de clientes manualmente.
            </p>
            <Link to="/feedbacks">
              <Button className="w-full">
                Acessar Feedbacks
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

  // Dashboard completo para administradores
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
          <div className="grid grid-cols-1 gap-6">
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