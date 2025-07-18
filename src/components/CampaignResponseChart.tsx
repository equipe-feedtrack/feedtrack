import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react"; // Importar o ícone

// Definindo a interface para os dados da campanha
interface CampaignData {
  name: string;
  "Taxa de Resposta": number;
}

// Dados de exemplo tipados
const data: CampaignData[] = [
  { name: "Black Friday", "Taxa de Resposta": 62 },
  { name: "Pós-Compra", "Taxa de Resposta": 63 },
  { name: "Natal", "Taxa de Resposta": 70 },
  { name: "Ano Novo", "Taxa de Resposta": 55 },
];

export const CampaignResponseChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Taxa de Resposta por Campanha
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
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
            <Bar dataKey="Taxa de Resposta" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};