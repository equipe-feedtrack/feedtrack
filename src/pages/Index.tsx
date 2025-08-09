// src/pages/Index.tsx

import { DashboardStats } from "@/components/DashboardStats";
import { RecentFeedback } from "@/components/RecentFeedback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Importe seus componentes de gráfico
import { CampaignResponseChart } from "@/components/CampaignResponseChart";
import { FeedbackDistributionChart } from "@/components/FeedbackDistributionChart";
import { SatisfactionTrendChart } from "@/components/SatisfactionTrendChart";
import { FeedbackByCategoryChart } from "@/components/FeedbackByCategoryChart";
import { Link } from "react-router-dom";
import { Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAdmin, isEmployee, user } = useAuth();

  // Visão para Funcionários
  if (isEmployee) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}!</h1>
          <p className="text-muted-foreground">Acesse rapidamente as suas principais funções.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" />Gerenciar Clientes</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground mb-4">Cadastre e gerencie informações dos clientes.</p><Link to="/customers"><Button className="w-full">Acessar Clientes</Button></Link></CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" />Criar Campanhas</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground mb-4">Crie e configure novas campanhas de feedback.</p><Link to="/campaigns"><Button className="w-full">Acessar Campanhas</Button></Link></CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-primary" />Gerenciar Feedbacks</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground mb-4">Adicione feedbacks de clientes manualmente.</p><Link to="/feedbacks"><Button className="w-full">Acessar Feedbacks</Button></Link></CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard limpo para Administradores
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard FeedTrack</h1>
        <p className="text-muted-foreground">
          Acompanhe as métricas de satisfação dos seus clientes em tempo real.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        {/* A lista de abas agora tem apenas 2 itens, focados em visualização */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Últimas Avaliações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <DashboardStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignResponseChart />
            <FeedbackDistributionChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SatisfactionTrendChart />
            <FeedbackByCategoryChart />
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <RecentFeedback />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;