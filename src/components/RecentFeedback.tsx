import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MessageSquare } from "lucide-react";

const feedbacks = [
  {
    id: 1,
    customer: "Maria Silva",
    product: "Smartphone XYZ",
    rating: 5,
    comment: "Produto excelente! Superou minhas expectativas em qualidade e desempenho.",
    date: "2 horas atrás",
    status: "new"
  },
  {
    id: 2,
    customer: "João Santos",
    product: "Notebook Pro",
    rating: 4,
    comment: "Muito bom, mas poderia ter mais memória RAM incluída.",
    date: "5 horas atrás",
    status: "reviewed"
  },
  {
    id: 3,
    customer: "Ana Costa",
    product: "Fone Bluetooth",
    rating: 5,
    comment: "Som perfeito e bateria dura muito. Recomendo!",
    date: "1 dia atrás",
    status: "reviewed"
  },
  {
    id: 4,
    customer: "Carlos Lima",
    product: "Smart TV 55\"",
    rating: 3,
    comment: "Boa TV, mas a interface poderia ser mais intuitiva.",
    date: "2 dias atrás",
    status: "reviewed"
  }
];

const getRatingColor = (rating: number) => {
  if (rating >= 4) return "text-success";
  if (rating >= 3) return "text-warning";
  return "text-destructive";
};

export const RecentFeedback = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Avaliações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{feedback.customer}</span>
                    <Badge variant={feedback.status === 'new' ? 'default' : 'secondary'}>
                      {feedback.status === 'new' ? 'Nova' : 'Revisada'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.product}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < feedback.rating 
                          ? `fill-current ${getRatingColor(feedback.rating)}` 
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm mb-2">{feedback.comment}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {feedback.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};