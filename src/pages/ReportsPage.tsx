import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, Download, Calendar as CalendarIcon, 
  TrendingUp, TrendingDown, Star, MessageSquare,
  Users, Eye, Filter, Lock
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  period: string;
  totalFeedbacks: number;
  averageRating: number;
  responseRate: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface TopProduct {
  name: string;
  rating: number;
  feedbacks: number;
  trend: "up" | "down" | "stable";
}

export const ReportsPage = () => {
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("last30days");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState("overview");

  useEffect(() => {
    if (!isAdmin && user?.role !== "master") {
      navigate("/");
    }
  }, [isAdmin, user, navigate]);

  // Dados simulados para demonstração
  const reportData: ReportData = {
    period: "Últimos 30 dias",
    totalFeedbacks: 2847,
    averageRating: 4.6,
    responseRate: 78.4,
    sentiment: {
      positive: 76,
      neutral: 18,
      negative: 6
    }
  };

  const topProducts: TopProduct[] = [
    { name: "Smartphone XYZ Pro", rating: 4.8, feedbacks: 342, trend: "up" },
    { name: "Notebook Ultra", rating: 4.7, feedbacks: 298, trend: "up" },
    { name: "Fone Bluetooth Premium", rating: 4.6, feedbacks: 267, trend: "stable" },
    { name: "Smart TV 55\"", rating: 4.2, feedbacks: 234, trend: "down" },
    { name: "Tablet Pro", rating: 4.5, feedbacks: 189, trend: "up" }
  ];

  const monthlyData = [
    { month: "Jan", feedbacks: 1205, rating: 4.3 },
    { month: "Fev", feedbacks: 1356, rating: 4.4 },
    { month: "Mar", feedbacks: 1578, rating: 4.5 },
    { month: "Abr", feedbacks: 1423, rating: 4.4 },
    { month: "Mai", feedbacks: 1689, rating: 4.6 },
    { month: "Jun", feedbacks: 1834, rating: 4.7 },
    { month: "Jul", feedbacks: 2012, rating: 4.6 },
    { month: "Ago", feedbacks: 2156, rating: 4.5 },
    { month: "Set", feedbacks: 2298, rating: 4.6 },
    { month: "Out", feedbacks: 2456, rating: 4.7 },
    { month: "Nov", feedbacks: 2847, rating: 4.6 }
  ];

  const handleExportReport = (format: string) => {
    toast({
      title: "Relatório exportado",
      description: `Relatório foi exportado em formato ${format.toUpperCase()}`
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  if (!isAdmin && user?.role !== "master") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Acesso Restrito</CardTitle>
            <p className="text-muted-foreground">
              Esta página é exclusiva para administradores
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-16 p-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Analytics</h1>
          <p className="text-muted-foreground">
            Análise detalhada do feedback dos clientes e métricas de performance
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport("pdf")}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("excel")}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("csv")}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="thisMonth">Este mês</SelectItem>
                  <SelectItem value="lastMonth">Mês passado</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="products">Por Produto</SelectItem>
                  <SelectItem value="campaigns">Por Campanha</SelectItem>
                  <SelectItem value="sentiment">Análise de Sentimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedPeriod === "custom" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Data personalizada</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/y", { locale: ptBR })} -{" "}
                            {format(dateRange.to, "dd/MM/y", { locale: ptBR })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/y", { locale: ptBR })
                        )
                      ) : (
                        "Selecionar período"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Feedbacks</p>
                <p className="text-2xl font-bold">{reportData.totalFeedbacks.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% vs período anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nota Média</p>
                <p className="text-2xl font-bold">{reportData.averageRating}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.3 vs período anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
                <p className="text-2xl font-bold">{reportData.responseRate}%</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.1% vs período anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sentimento Positivo</p>
                <p className="text-2xl font-bold">{reportData.sentiment.positive}%</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2.3% vs período anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução dos Feedbacks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.slice(-6).map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-sm text-muted-foreground">{data.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{data.feedbacks}</div>
                        <div className="text-xs text-muted-foreground">feedbacks</div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(data.feedbacks / Math.max(...monthlyData.map(d => d.feedbacks))) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    <span className="text-sm font-medium">{data.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Análise de Sentimento */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Sentimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Positivo</span>
                <span className="text-sm font-medium">{reportData.sentiment.positive}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-success h-3 rounded-full transition-all duration-500"
                  style={{ width: `${reportData.sentiment.positive}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Neutro</span>
                <span className="text-sm font-medium">{reportData.sentiment.neutral}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-warning h-3 rounded-full transition-all duration-500"
                  style={{ width: `${reportData.sentiment.neutral}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Negativo</span>
                <span className="text-sm font-medium">{reportData.sentiment.negative}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-destructive h-3 rounded-full transition-all duration-500"
                  style={{ width: `${reportData.sentiment.negative}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Avaliados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.feedbacks} avaliações</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  {getTrendIcon(product.trend)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-success pl-4">
              <h4 className="font-medium text-success">Excelente Performance</h4>
              <p className="text-sm text-muted-foreground">
                A taxa de resposta aumentou 5.1% este mês. Continue enviando campanhas personalizadas.
              </p>
            </div>
            
            <div className="border-l-4 border-warning pl-4">
              <h4 className="font-medium text-warning">Atenção Necessária</h4>
              <p className="text-sm text-muted-foreground">
                Smart TV 55" teve queda na avaliação. Recomenda-se investigar os comentários negativos.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium text-primary">Oportunidade</h4>
              <p className="text-sm text-muted-foreground">
                Produtos eletrônicos têm alta taxa de resposta. Considere campanhas específicas para esta categoria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};