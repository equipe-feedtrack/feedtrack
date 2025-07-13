import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { 
  Send, Plus, Edit, Trash2, Play, Pause, Users, 
  Calendar as CalendarIcon, MessageSquare, Settings, 
  Eye, Target, BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Campaign {
  id: number;
  name: string;
  description: string;
  type: string;
  targetSegment: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "paused" | "completed";
  messageTemplate: string;
  targetCustomers: number;
  sentMessages: number;
  responses: number;
  createdAt: Date;
}

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Campanha Black Friday",
    description: "Feedback sobre produtos eletrônicos comprados na Black Friday",
    type: "post_purchase",
    targetSegment: "premium",
    startDate: new Date(2024, 10, 15),
    endDate: new Date(2024, 11, 15),
    status: "active",
    messageTemplate: "Olá {nome}! Como foi sua experiência com o {produto}? Nos ajude avaliando sua compra.",
    targetCustomers: 156,
    sentMessages: 142,
    responses: 89,
    createdAt: new Date(2024, 10, 10)
  },
  {
    id: 2,
    name: "Feedback Pós-Compra",
    description: "Avaliação automática para todas as compras",
    type: "automatic",
    targetSegment: "all",
    startDate: new Date(2024, 10, 1),
    endDate: new Date(2024, 11, 31),
    status: "active",
    messageTemplate: "Ei {nome}, que tal avaliar sua última compra? Sua opinião é muito importante!",
    targetCustomers: 298,
    sentMessages: 298,
    responses: 187,
    createdAt: new Date(2024, 9, 25)
  }
];

export const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "post_purchase",
    targetSegment: "all",
    startDate: new Date(),
    endDate: new Date(),
    messageTemplate: ""
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.messageTemplate) {
      toast({
        title: "Erro",
        description: "Nome e template da mensagem são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const campaign: Campaign = {
      id: Math.max(...campaigns.map(c => c.id)) + 1,
      ...newCampaign,
      status: "draft",
      targetCustomers: 0,
      sentMessages: 0,
      responses: 0,
      createdAt: new Date()
    };

    setCampaigns([...campaigns, campaign]);
    setNewCampaign({
      name: "",
      description: "",
      type: "post_purchase",
      targetSegment: "all",
      startDate: new Date(),
      endDate: new Date(),
      messageTemplate: ""
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Campanha criada",
      description: "Nova campanha foi criada com sucesso!"
    });
  };

  const handleStartCampaign = (id: number) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: "active" as const } : c
    ));
    toast({
      title: "Campanha iniciada",
      description: "A campanha foi ativada e começará a enviar mensagens"
    });
  };

  const handlePauseCampaign = (id: number) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: "paused" as const } : c
    ));
    toast({
      title: "Campanha pausada",
      description: "A campanha foi pausada temporariamente"
    });
  };

  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast({
      title: "Campanha removida",
      description: "Campanha foi removida do sistema"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Ativa</Badge>;
      case 'paused':
        return <Badge className="bg-warning text-warning-foreground">Pausada</Badge>;
      case 'completed':
        return <Badge variant="secondary">Concluída</Badge>;
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getResponseRate = (sent: number, responses: number) => {
    return sent > 0 ? Math.round((responses / sent) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campanhas de Feedback</h1>
          <p className="text-muted-foreground">
            Crie e gerencie campanhas de coleta de feedback dos clientes
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Campanha *</Label>
                <Input
                  id="name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  placeholder="Ex: Feedback Black Friday 2024"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                  placeholder="Descreva o objetivo desta campanha..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo de Campanha</Label>
                  <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({...newCampaign, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post_purchase">Pós-Compra</SelectItem>
                      <SelectItem value="automatic">Automática</SelectItem>
                      <SelectItem value="promotional">Promocional</SelectItem>
                      <SelectItem value="satisfaction">Satisfação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="segment">Segmento Alvo</Label>
                  <Select value={newCampaign.targetSegment} onValueChange={(value) => setNewCampaign({...newCampaign, targetSegment: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Clientes</SelectItem>
                      <SelectItem value="new">Novos Clientes</SelectItem>
                      <SelectItem value="regular">Clientes Regulares</SelectItem>
                      <SelectItem value="premium">Clientes Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newCampaign.startDate, "dd/MM/yyyy", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newCampaign.startDate}
                        onSelect={(date) => date && setNewCampaign({...newCampaign, startDate: date})}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newCampaign.endDate, "dd/MM/yyyy", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newCampaign.endDate}
                        onSelect={(date) => date && setNewCampaign({...newCampaign, endDate: date})}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="template">Template da Mensagem *</Label>
                <Textarea
                  id="template"
                  value={newCampaign.messageTemplate}
                  onChange={(e) => setNewCampaign({...newCampaign, messageTemplate: e.target.value})}
                  placeholder="Use {nome} para o nome do cliente e {produto} para o produto..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Variáveis disponíveis: {"{nome}"}, {"{produto}"}, {"{data_compra}"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCampaign} className="flex-1">
                  Criar Campanha
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Campanhas Ativas</p>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.sentMessages, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Respostas Recebidas</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.responses, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Taxa Média</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    campaigns.reduce((acc, c) => acc + getResponseRate(c.sentMessages, c.responses), 0) / 
                    campaigns.length || 0
                  )}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Campanhas */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Tipo: {campaign.type}</span>
                      <span>Segmento: {campaign.targetSegment}</span>
                      <span>
                        Período: {format(campaign.startDate, "dd/MM", { locale: ptBR })} - {format(campaign.endDate, "dd/MM", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button size="sm" onClick={() => handleStartCampaign(campaign.id)}>
                        <Play className="w-3 h-3 mr-1" />
                        Iniciar
                      </Button>
                    )}
                    {campaign.status === 'active' && (
                      <Button size="sm" variant="warning" onClick={() => handlePauseCampaign(campaign.id)}>
                        <Pause className="w-3 h-3 mr-1" />
                        Pausar
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setSelectedCampaign(campaign)}>
                      <Eye className="w-3 h-3 mr-1" />
                      Detalhes
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingCampaign(campaign)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteCampaign(campaign.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Métricas da Campanha */}
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">{campaign.targetCustomers}</p>
                    <p className="text-xs text-muted-foreground">Clientes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Send className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">{campaign.sentMessages}</p>
                    <p className="text-xs text-muted-foreground">Enviadas</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageSquare className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">{campaign.responses}</p>
                    <p className="text-xs text-muted-foreground">Respostas</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BarChart3 className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">{getResponseRate(campaign.sentMessages, campaign.responses)}%</p>
                    <p className="text-xs text-muted-foreground">Taxa</p>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progresso de Envio</span>
                    <span>{campaign.sentMessages} / {campaign.targetCustomers}</span>
                  </div>
                  <Progress 
                    value={campaign.targetCustomers > 0 ? (campaign.sentMessages / campaign.targetCustomers) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Campanha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <p className="font-medium">{selectedCampaign.name}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <p>{selectedCampaign.type}</p>
                </div>
                <div>
                  <Label>Segmento Alvo</Label>
                  <p>{selectedCampaign.targetSegment}</p>
                </div>
              </div>
              <div>
                <Label>Descrição</Label>
                <p>{selectedCampaign.description}</p>
              </div>
              <div>
                <Label>Template da Mensagem</Label>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">{selectedCampaign.messageTemplate}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedCampaign.targetCustomers}</p>
                  <p className="text-xs text-muted-foreground">Clientes Alvo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedCampaign.sentMessages}</p>
                  <p className="text-xs text-muted-foreground">Mensagens Enviadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedCampaign.responses}</p>
                  <p className="text-xs text-muted-foreground">Respostas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {getResponseRate(selectedCampaign.sentMessages, selectedCampaign.responses)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Taxa de Resposta</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};