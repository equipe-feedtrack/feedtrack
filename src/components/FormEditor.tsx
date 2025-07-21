// src/components/FormEditor.tsx

import { useForm } from "@/contexts/FormContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox"; // 👈 1. Importar Checkbox
import { Trash2, Plus } from "lucide-react";

export const FormEditor = () => {
  const { formSections, updateSection, addSection, deleteSection } = useForm();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor de Formulário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" className="w-full">
          {formSections.map(section => (
            <AccordionItem value={section.id} key={section.id}>
              <AccordionTrigger className="font-semibold">{section.title}</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <Label>Título da Seção</Label>
                  <Input value={section.title} onChange={e => updateSection(section.id, { title: e.target.value })} />
                </div>

                {/* 2. Adicionando os Checkboxes */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`hasRating-${section.id}`} 
                      checked={section.hasRating}
                      onCheckedChange={checked => updateSection(section.id, { hasRating: !!checked })}
                    />
                    <label htmlFor={`hasRating-${section.id}`} className="text-sm font-medium">Incluir avaliação por estrelas?</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`hasComment-${section.id}`}
                      checked={section.hasComment}
                      onCheckedChange={checked => updateSection(section.id, { hasComment: !!checked })}
                    />
                    <label htmlFor={`hasComment-${section.id}`} className="text-sm font-medium">Incluir campo de comentário?</label>
                  </div>
                </div>

                {/* 3. Campos de texto aparecem condicionalmente */}
                {section.hasRating && (
                  <div>
                    <Label>Pergunta da Avaliação (se ativa)</Label>
                    <Input value={section.ratingPrompt} onChange={e => updateSection(section.id, { ratingPrompt: e.target.value })} />
                  </div>
                )}
                
                {section.hasComment && (
                  <div className="space-y-4">
                    <div>
                      <Label>Pergunta do Comentário (se ativa)</Label>
                      <Input value={section.commentPrompt} onChange={e => updateSection(section.id, { commentPrompt: e.target.value })} />
                    </div>
                    <div>
                      <Label>Placeholder do Comentário (se ativo)</Label>
                      <Textarea value={section.commentPlaceholder} onChange={e => updateSection(section.id, { commentPlaceholder: e.target.value })} />
                    </div>
                  </div>
                )}
                
                <Button variant="destructive" size="sm" onClick={() => deleteSection(section.id)}>
                  <Trash2 className="w-4 h-4 mr-2"/>Remover Seção
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="pt-4 border-t">
          <Button onClick={addSection} className="w-full"><Plus className="w-4 h-4 mr-2" />Adicionar Nova Seção</Button>
        </div>
      </CardContent>
    </Card>
  );
}