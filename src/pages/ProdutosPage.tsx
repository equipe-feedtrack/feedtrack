// src/pages/ProdutosPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProduct, Product } from "../contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Separa os produtos entre ativos e inativos usando useMemo para otimização
  const { activeProducts, inactiveProducts } = useMemo(() => {
    const active: Product[] = [];
    const inactive: Product[] = [];
    products.forEach(p => {
      if (p.ativo) {
        active.push(p);
      } else {
        inactive.push(p);
      }
    });
    return { activeProducts: active, inactiveProducts: inactive };
  }, [products]);

  // Atualiza a lista de produtos exibidos (apenas ativos) quando a busca ou a lista principal muda
  useEffect(() => {
    if (searchTerm) {
      const filtered = activeProducts.filter((p) =>
        (p.nome || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedProducts(filtered);
    } else {
      setDisplayedProducts(activeProducts);
    }
  }, [activeProducts, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [newData, setNewData] = useState({ nome: "", descricao: "", valor: 0 });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newData.nome.trim() && newData.descricao.trim() && newData.valor > 0) {
      const newProduct = await addProduct(newData); 
      if (newProduct) {
        setNewData({ nome: "", descricao: "", valor: 0 });
        setIsAddDialogOpen(false);
        if (location.state?.from === "/feedbacks") {
          navigate("/feedbacks", { state: { newProductId: newProduct.id } });
        }
      }
    } else {
      toast({
        title: "Erro de Validação",
        description: "Preencha todos os campos corretamente.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    await updateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Esta função agora desativa o produto
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Tem certeza que deseja desativar este produto? Ele será movido para a lista de inativos.")) {
      await deleteProduct(id);
    }
  };

  // Nova função para reativar um produto
  const handleReactivateProduct = async (product: Product) => {
    const productToReactivate = {
      ...product,
      ativo: true,
      dataExclusao: null,
    };
    await updateProduct(productToReactivate);
    toast({ title: "Sucesso!", description: `Produto "${product.nome}" foi reativado.` });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
        <div className="flex items-center gap-2">
          {/* Botão para abrir o modal de inativos */}
          <Button variant="outline" onClick={() => setIsInactiveModalOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Ver Inativos ({inactiveProducts.length})
          </Button>
          {/* Botão para adicionar novo produto */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Produto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input id="nome" value={newData.nome} onChange={(e) => setNewData({ ...newData, nome: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input id="descricao" value={newData.descricao} onChange={(e) => setNewData({ ...newData, descricao: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input id="valor" type="number" step="0.01" value={newData.valor === 0 ? '' : newData.valor} onChange={(e) => setNewData({ ...newData, valor: Number(e.target.value) || 0 })} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit">Cadastrar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Input placeholder="Pesquisar produto pelo nome..." value={searchTerm} onChange={handleSearchChange} />

      {/* Card que exibe apenas os produtos ATIVOS */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Ativos ({displayedProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayedProducts.map((p) => (
              <div key={p.id} className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50">
                <div>
                  <p className="font-medium">{p.nome}</p>
                  <p className="text-sm text-gray-500">{p.descricao}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {(p.valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  <Button variant="outline" size="icon" onClick={() => setEditingProduct(p)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
            {displayedProducts.length === 0 && (<p className="text-center text-gray-500">Nenhum produto ativo encontrado.</p>)}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição (sem grandes alterações) */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Produto</Label>
                <Input value={editingProduct.nome} onChange={(e) => setEditingProduct({ ...editingProduct, nome: e.target.value })} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input value={editingProduct.descricao} onChange={(e) => setEditingProduct({ ...editingProduct, descricao: e.target.value })} />
              </div>
              <div>
                <Label>Valor (R$)</Label>
                <Input type="number" step="0.01" value={editingProduct.valor} onChange={(e) => setEditingProduct({ ...editingProduct, valor: Number(e.target.value) || 0 })} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancelar</Button>
                <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* NOVO MODAL: Para visualizar e reativar produtos inativos */}
      <Dialog open={isInactiveModalOpen} onOpenChange={setIsInactiveModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Produtos Inativos</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-[60vh] overflow-y-auto">
            {inactiveProducts.length > 0 ? (
              inactiveProducts.map((p) => (
                <div key={p.id} className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium text-muted-foreground">{p.nome}</p>
                    {p.dataExclusao && <p className="text-sm text-gray-500">Desativado em: {new Date(p.dataExclusao).toLocaleDateString('pt-BR')}</p>}
                  </div>
                  <Button onClick={() => handleReactivateProduct(p)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reativar
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Nenhum produto inativo.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
