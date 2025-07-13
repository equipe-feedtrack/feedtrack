import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, MessageSquare, Star, Users } from "lucide-react";

const stats = [
  {
    title: "Total de Avaliações",
    value: "2.847",
    change: "+12.5%",
    icon: MessageSquare,
    color: "text-primary"
  },
  {
    title: "Nota Média",
    value: "4.6",
    change: "+0.3",
    icon: Star,
    color: "text-warning"
  },
  {
    title: "Clientes Ativos",
    value: "1.293",
    change: "+8.2%",
    icon: Users,
    color: "text-success"
  },
  {
    title: "Taxa de Resposta",
    value: "78.4%",
    change: "+5.1%",
    icon: TrendingUp,
    color: "text-primary"
  }
];

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:scale-105 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-success">
              {stat.change} em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};