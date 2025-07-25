// src/pages/ProdutosPage.tsx

import React, { useState, useEffect } from "react"; // Adicione useEffect
import { useLocation, useNavigate } from "react-router-dom";
import { useProduct, Product } from "../contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // NOVO ESTADO: Para armazenar os produtos que serão exibidos (filtrados ou todos)
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  // NOVO ESTADO: Para armazenar o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  // NOVO useEffect: Para atualizar displayedProducts sempre que 'products' mudar
  // Isso garante que a lista exibida seja inicializada com todos os produtos
  // e que a pesquisa seja aplicada à lista mais recente.
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedProducts(filtered);
    } else {
      setDisplayedProducts(products);
    }
  }, [products, searchTerm]); // Depende de 'products' e 'searchTerm'

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [newData, setNewData] = useState({ name: "", category: "", price: 0 });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newData.name.trim() && newData.category.trim() && newData.price > 0) {
      const newProduct = addProduct(
        newData.name,
        newData.category,
        newData.price
      );
      setNewData({ name: "", category: "", price: 0 });
      setIsAddDialogOpen(false);
      toast({
        title: "Sucesso!",
        description: `Produto "${newProduct.name}" cadastrado.`,
      });
      if (location.state?.from === "/feedbacks") {
        navigate("/feedbacks", { state: { newProductId: newProduct.id } });
      }
    } else {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct);
    toast({ title: "Sucesso!", description: "Produto atualizado." });
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduct(id);
      toast({ title: "Sucesso!", description: "Produto excluído." });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
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
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={newData.name}
                  onChange={(e) =>
                    setNewData({ ...newData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={newData.category}
                  onChange={(e) =>
                    setNewData({ ...newData, category: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newData.price}
                  onChange={(e) =>
                    setNewData({ ...newData, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Pesquisar produto..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados ({displayedProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayedProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {p.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingProduct(p)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteProduct(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {displayedProducts.length === 0 && (
              <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {editingProduct && (
        <Dialog
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Produto</Label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Input
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};