import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Send, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria feita a integração com o backend para salvar a avaliação
    console.log("Avaliação enviada:", { rating, comment });
    
    setSubmitted(true);
    toast({
      title: "Avaliação enviada!",
      description: "Obrigado pelo seu feedback. Sua opinião é muito importante para nós.",
    });
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Obrigado pelo seu feedback!</h3>
          <p className="text-muted-foreground mb-4">
            Sua avaliação foi registrada com sucesso. Valorizamos muito sua opinião.
          </p>
          <Badge className="bg-success text-success-foreground">
            Avaliação: {rating} estrelas
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-warning" />
          Avalie sua Compra
        </CardTitle>
        <div className="text-center">
          <Badge variant="outline" className="mb-2">Smartphone XYZ Pro</Badge>
          <p className="text-sm text-muted-foreground">
            Pedido #12345 - Entregue em 10/Nov/2024
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium mb-3">Como você avalia este produto?</p>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-warning text-warning'
                        : 'text-muted-foreground hover:text-warning'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-muted-foreground">
                {rating === 1 && "Muito ruim"}
                {rating === 2 && "Ruim"} 
                {rating === 3 && "Regular"}
                {rating === 4 && "Bom"}
                {rating === 5 && "Excelente"}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="comment" className="text-sm font-medium block mb-2">
              Conte-nos mais sobre sua experiência (opcional)
            </label>
            <Textarea
              id="comment"
              placeholder="Deixe seu comentário sobre o produto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={rating === 0}>
            <Send className="w-4 h-4 mr-2" />
            Enviar Avaliação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};