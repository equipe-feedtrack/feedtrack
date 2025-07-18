import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

// Definindo a interface para os dados de distribuição de feedback
interface FeedbackData {
  name: string;
  value: number;
}

// Dados de exemplo tipados
const data: FeedbackData[] = [
  { name: "5 Estrelas", value: 300 },
  { name: "4 Estrelas", value: 200 },
  { name: "3 Estrelas", value: 150 },
  { name: "2 Estrelas", value: 50 },
  { name: "1 Estrela", value: 30 },
];

const COLORS: string[] = ["#00C49F", "#FFBB28", "#FF8042", "#FF4500", "#FF0000"]; // Cores para cada fatia

export const FeedbackDistributionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" /> Distribuição de Avaliações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};