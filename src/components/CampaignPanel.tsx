import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Users, Calendar, MoreVertical } from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Campanha Black Friday",
    type: "Produtos Eletrônicos",
    customers: 156,
    sent: 142,
    responses: 89,
    status: "active",
    startDate: "15/Nov"
  },
  {
    id: 2,
    name: "Feedback Pós-Compra",
    type: "Todos os Produtos",
    customers: 98,
    sent: 98,
    responses: 67,
    status: "completed",
    startDate: "10/Nov"
  },
  {
    id: 3,
    name: "Novos Clientes",
    type: "Categoria Roupas",
    customers: 45,
    sent: 0,
    responses: 0,
    status: "draft",
    startDate: "20/Nov"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-success text-success-foreground">Ativa</Badge>;
    case 'completed':
      return <Badge variant="secondary">Concluída</Badge>;
    case 'draft':
      return <Badge variant="outline">Rascunho</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const CampaignPanel = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Campanhas de Feedback
        </CardTitle>
        <Button>Nova Campanha</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{campaign.name}</h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{campaign.type}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">{campaign.customers}</p>
                  <p className="text-xs text-muted-foreground">Clientes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Send className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">{campaign.sent}</p>
                  <p className="text-xs text-muted-foreground">Enviadas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Badge variant="outline" className="w-3 h-3 p-0 border-none bg-success">
                      <span className="sr-only">Responses</span>
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{campaign.responses}</p>
                  <p className="text-xs text-muted-foreground">Respostas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">{campaign.startDate}</p>
                  <p className="text-xs text-muted-foreground">Início</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  Taxa de resposta: {campaign.sent > 0 ? Math.round((campaign.responses / campaign.sent) * 100) : 0}%
                </div>
                <div className="flex gap-2">
                  {campaign.status === 'draft' && (
                    <Button size="sm" variant="outline">Iniciar</Button>
                  )}
                  <Button size="sm" variant="ghost">Ver Detalhes</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};