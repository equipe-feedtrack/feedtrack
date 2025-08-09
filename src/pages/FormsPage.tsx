import React, { useState, useEffect } from "react";
import { useForm, Pergunta, Formulario } from "@/contexts/FormContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Componente para o Modal de Criação de Pergunta
const CreateQuestionModal = ({
  onQuestionCreated,
}: {
  onQuestionCreated: (newQuestion: Pergunta) => void;
}) => {
  const { addQuestion } = useForm();
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState<"nota" | "texto" | "multipla_escolha">("nota");

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
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Criar Nova Pergunta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Pergunta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="question-text">Texto da Pergunta</Label>
            <Input
              id="question-text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="question-type">Tipo de Pergunta</Label>
            <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nota">Nota (1-5)</SelectItem>
                <SelectItem value="texto">Texto Aberto</SelectItem>
                <SelectItem value="multipla_escolha" disabled>
                  Múltipla Escolha (em breve)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsQuestionModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleCreateQuestion}>Criar Pergunta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Componente para o Modal de Edição de Formulário
const EditFormModal = ({
  form,
  isOpen,
  onOpenChange,
}: {
  form: Formulario | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { perguntas, updateForm } = useForm();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  useEffect(() => {
    if (form) {
      setTitulo(form.titulo);
      setDescricao(form.descricao);
      // CORRECTED: Use p.id since the data is now normalized
      setSelectedQuestionIds(form.perguntas.map((p) => p.id));
    }
  }, [form]);

  const handleUpdate = async () => {
    if (!form) return;
    await updateForm(form.id, {
      titulo,
      descricao,
      idsPerguntas: selectedQuestionIds,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Formulário</DialogTitle>
          <DialogDescription>
            Altere o título, descrição e as perguntas do seu formulário.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Detalhes do Formulário</h3>
            <div>
              <Label htmlFor="edit-form-title">Título</Label>
              <Input
                id="edit-form-title"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-form-desc">Descrição</Label>
              <Input
                id="edit-form-desc"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Perguntas Disponíveis</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
              {perguntas.map((p) => (
                // CORRECTED: Use p.id for keys and all other attributes
                <div key={p.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-q-${p.id}`}
                    checked={selectedQuestionIds.includes(p.id)}
                    onCheckedChange={(checked) => {
                      setSelectedQuestionIds((prev) =>
                        checked
                          ? [...prev, p.id]
                          : prev.filter((id) => id !== p.id)
                      );
                    }}
                  />
                  <label htmlFor={`edit-q-${p.id}`} className="text-sm">
                    {p.texto}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleUpdate}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Página Principal de Formulários
export const FormsPage = () => {
  const { formularios, perguntas, addForm, deleteForm, getFormById, loading } = useForm();
  const { toast } = useToast();

  // Estados para o modal de criação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Estados para o modal de edição
  const [formToEdit, setFormToEdit] = useState<Formulario | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreateForm = async () => {
    if (!titulo || selectedQuestionIds.length === 0) {
      toast({
        title: "Erro de Validação",
        description: "Título e ao menos uma pergunta são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    const newForm = await addForm({
      titulo,
      descricao,
      idsPerguntas: selectedQuestionIds,
    });
    if (newForm) {
      setTitulo("");
      setDescricao("");
      setSelectedQuestionIds([]);
      setIsCreateModalOpen(false);
    }
  };

  const handleEditClick = async (formId: string) => {
    setEditingId(formId);
    try {
      const formData = await getFormById(formId);
      if (formData) {
        setFormToEdit(formData);
      }
    } finally {
      setEditingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Formulários</h1>
          <p className="text-muted-foreground">
            Crie e gerencie seus formulários de feedback.
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Formulário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Formulário</DialogTitle>
              <DialogDescription>
                Defina um título e selecione as perguntas que farão parte deste formulário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-8 py-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Detalhes do Formulário</h3>
                <div>
                  <Label htmlFor="form-title">Título</Label>
                  <Input
                    id="form-title"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="form-desc">Descrição</Label>
                  <Input
                    id="form-desc"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Perguntas Disponíveis</h3>
                  <CreateQuestionModal
                    onQuestionCreated={(newQuestion) => {
                      // CORRECTED: Use newQuestion.id
                      setSelectedQuestionIds((prev) => [
                        ...prev,
                        newQuestion.id,
                      ]);
                    }}
                  />
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
                  {perguntas.map((p) => (
                    // CORRECTED: Use p.id for keys and all attributes
                    <div key={p.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`q-${p.id}`}
                        checked={selectedQuestionIds.includes(p.id)}
                        onCheckedChange={(checked) => {
                          setSelectedQuestionIds((prev) =>
                            checked
                              ? [...prev, p.id]
                              : prev.filter((id) => id !== p.id)
                          );
                        }}
                      />
                      <label htmlFor={`q-${p.id}`} className="text-sm">
                        {p.texto || 'Pergunta sem texto'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateForm}>Criar Formulário</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulários Criados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="animate-spin w-6 h-6 text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {formularios.map((form) => (
                <Card key={form.id}>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle>{form.titulo}</CardTitle>
                      <CardDescription>{form.descricao}</CardDescription>
                    </div>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {editingId === form.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <MoreVertical className="w-4 h-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => handleEditClick(form.id)}
                            disabled={!!editingId}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 focus:text-red-600"
                              disabled={!!editingId}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá
                            permanentemente o formulário "{form.titulo}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteForm(form.id)}
                          >
                            Sim, excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-semibold mb-2">
                      Perguntas ({(form.perguntas || []).length}):
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {/* CORRECTED: Use p.id and p.texto */}
                      {(form.perguntas || []).map((p) => (
                        <li key={p.id}>{p.texto || 'Pergunta sem texto'}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditFormModal
        isOpen={!!formToEdit}
        onOpenChange={(open) => !open && setFormToEdit(null)}
        form={formToEdit}
      />
    </div>
  );
};
