// src/pages/FormsPage.tsx

import React, { useState } from "react";
import { useForm, Pergunta } from "@/contexts/FormContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Componente para o Modal de Criação de Perguntas
const CreateQuestionModal = ({ onQuestionCreated }: { onQuestionCreated: (newQuestion: Pergunta) => void }) => {
    const { addQuestion } = useForm();
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [texto, setTexto] = useState("");
    const [tipo, setTipo] = useState<'nota' | 'texto' | 'multipla_escolha'>('nota');

    const handleCreateQuestion = async () => {
        if (!texto) return;
        const newQuestion = await addQuestion({ texto, tipo });
        if (newQuestion) {
            onQuestionCreated(newQuestion);
            setTexto("");
            setTipo("nota");
            setIsQuestionModalOpen(false);
        }
    };

    return (
        <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" />Criar Nova Pergunta</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Nova Pergunta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="question-text">Texto da Pergunta</Label>
                        <Input id="question-text" value={texto} onChange={(e) => setTexto(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="question-type">Tipo de Pergunta</Label>
                        <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nota">Nota (1-5)</SelectItem>
                                <SelectItem value="texto">Texto Aberto</SelectItem>
                                <SelectItem value="multipla_escolha">Múltipla Escolha (em breve)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsQuestionModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreateQuestion}>Criar Pergunta</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Página Principal de Formulários
export const FormsPage = () => {
    const { formularios, perguntas, addForm, loading } = useForm();
    const { toast } = useToast();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

    const handleCreateForm = async () => {
        if (!titulo || selectedQuestionIds.length === 0) {
            toast({ title: "Erro", description: "Título e pelo menos uma pergunta são necessários.", variant: "destructive" });
            return;
        }
        const newForm = await addForm({ titulo, descricao, idsPerguntas: selectedQuestionIds });
        if (newForm) {
            setTitulo("");
            setDescricao("");
            setSelectedQuestionIds([]);
            setIsFormModalOpen(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Gestão de Formulários</h1>
                    <p className="text-muted-foreground">Crie e gerencie seus formulários de feedback.</p>
                </div>
                <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="w-4 h-4 mr-2" />Novo Formulário</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Criar Novo Formulário</DialogTitle>
                            <DialogDescription>Defina um título e selecione as perguntas que farão parte deste formulário.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-8 py-4">
                            <div className="space-y-4">
                                <h3 className="font-semibold">Detalhes do Formulário</h3>
                                <div><Label htmlFor="form-title">Título</Label><Input id="form-title" value={titulo} onChange={(e) => setTitulo(e.target.value)} /></div>
                                <div><Label htmlFor="form-desc">Descrição</Label><Input id="form-desc" value={descricao} onChange={(e) => setDescricao(e.target.value)} /></div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">Perguntas Disponíveis</h3>
                                    <CreateQuestionModal onQuestionCreated={(newQuestion) => {
                                        setSelectedQuestionIds(prev => [...prev, newQuestion.id]);
                                    }} />
                                </div>
                                <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
                                    {perguntas.map(p => (
                                        <div key={p.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`q-${p.id}`}
                                                checked={selectedQuestionIds.includes(p.id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedQuestionIds(prev => 
                                                        checked ? [...prev, p.id] : prev.filter(id => id !== p.id)
                                                    );
                                                }}
                                            />
                                            <label htmlFor={`q-${p.id}`} className="text-sm">{p.texto}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancelar</Button>
                            <Button onClick={handleCreateForm}>Criar Formulário</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Formulários Criados</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin" /></div> :
                        <div className="space-y-4">
                            {formularios.map(form => (
                                <Card key={form.id}>
                                    <CardHeader>
                                        <CardTitle>{form.titulo}</CardTitle>
                                        <CardDescription>{form.descricao}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <<< CORRIGIDO: Adicionada verificação para `form.perguntas` */}
                                        <p className="text-sm font-semibold mb-2">Perguntas ({(form.perguntas || []).length}):</p>
                                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                            {(form.perguntas || []).map(p => <li key={p.id}>{p.texto}</li>)}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    }
                </CardContent>
            </Card>
        </div>
    );
};
