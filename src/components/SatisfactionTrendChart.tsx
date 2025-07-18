import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react"; // Novo ícone para tendência

// Definindo a interface para os dados de tendência de satisfação
interface SatisfactionTrendData {
  name: string; // Ex: "Semana 1", "Mês 1", "Jan"
  satisfactionScore: number; // Ex: NPS ou Média de Estrelas
}

// Dados de exemplo tipados para a tendência de satisfação
const data: SatisfactionTrendData[] = [
  { name: "Jan", satisfactionScore: 75 },
  { name: "Fev", satisfactionScore: 78 },
  { name: "Mar", satisfactionScore: 82 },
  { name: "Abr", satisfactionScore: 79 },
  { name: "Mai", satisfactionScore: 85 },
  { name: "Jun", satisfactionScore: 83 },
];

export const SatisfactionTrendChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Tendência de Satisfação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="satisfactionScore"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};