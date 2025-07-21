// src/components/FeedbackForm.tsx

import { useState } from "react";
import { useForm, iconMap } from "@/contexts/FormContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRatings";
import { Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ResponseData = { rating?: number; comment?: string; };

export const FeedbackForm = () => {
  const { formSections } = useForm();
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, ResponseData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResponseChange = (sectionId: string, value: Partial<ResponseData>) => {
    setResponses(prev => ({ ...prev, [sectionId]: { ...(prev[sectionId] || {}), ...value } }));
  };
  
  const handleSubmit = () => {
    console.log("Respostas Finais:", responses);
    setIsSubmitted(true);
    toast({ title: "Feedback enviado com sucesso!" });
  };

  if (isSubmitted) {
    return (
      <Card><CardContent className="p-8 text-center"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /><h2 className="text-2xl font-bold">Obrigado!</h2><p className="text-muted-foreground">Sua avaliação foi recebida.</p></CardContent></Card>
    );
  }

   return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            {formSections.map(section => {
                const IconComponent = iconMap[section.icon];
                return (
                    <Card key={section.id} className="shadow-soft">
                        <CardHeader><CardTitle className="flex items-center gap-2"><IconComponent />{section.title}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {/* 👇 Mostra a avaliação apenas se hasRating for true 👇 */}
                            {section.hasRating && (
                                <div>
                                    <Label>{section.ratingPrompt}</Label>
                                    <StarRating rating={responses[section.id]?.rating || 0} onRatingChange={rating => handleResponseChange(section.id, { rating })} size={28} className="mt-2" />
                                    {responses[section.id]?.rating > 0 && <p className="text-xs text-muted-foreground h-4 mt-1">{section.starLabels[responses[section.id]?.rating || 0]}</p>}
                                </div>
                            )}
                            {/* 👇 Mostra o comentário apenas se hasComment for true 👇 */}
                            {section.hasComment && (
                                <div>
                                    <Label>{section.commentPrompt}</Label>
                                    <Textarea placeholder={section.commentPlaceholder} onChange={e => handleResponseChange(section.id, { comment: e.target.value })} className="mt-2 min-h-[100px]" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
        <Card>
            <CardContent className="p-4"><Button onClick={handleSubmit} className="w-full text-lg py-6"><Send className="w-5 h-5 mr-2" />Enviar Avaliação</Button></CardContent>
        </Card>
    </div>
  );
};