// src/pages/FeedbacksPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomer, Customer } from "../contexts/CustomerContext";
import { useProduct, Product } from "../contexts/ProductContext";

import {
  Star,
  Search,
  X,
  Trash2,
  User,
  ShoppingBag,
  Building,
  FilterX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Feedback = {
  id: number;
  customerId: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  employeeName: string;
  productName: string;
  type: "Atendimento" | "Produto" | "Empresa";
};
type Alerta = { tipo: "success" | "danger"; mensagem: string };

const initialFeedbacks: Feedback[] = [
  // Adicionando mais feedbacks para testar a paginação
  {
    id: 1,
    customerId: 101,
    customerName: "Ana Silva",
    rating: 5,
    comment: "Atendimento excelente do João.",
    date: "2025-07-20",
    employeeName: "João Martins",
    productName: "Smartphone X",
    type: "Atendimento",
  },
  {
    id: 2,
    customerId: 102,
    customerName: "Carlos Pereira",
    rating: 4,
    comment: "Produto muito bom, mas a entrega atrasou.",
    date: "2025-07-21",
    employeeName: "N/A",
    productName: "Fone de Ouvido Y",
    type: "Produto",
  },
  {
    id: 3,
    customerId: 103,
    customerName: "Beatriz Costa",
    rating: 2,
    comment: "A loja estava desorganizada.",
    date: "2025-07-22",
    employeeName: "N/A",
    productName: "N/A",
    type: "Empresa",
  },
  {
    id: 4,
    customerId: 101,
    customerName: "Ana Silva",
    rating: 3,
    comment: "O aplicativo da loja é um pouco lento.",
    date: "2025-07-23",
    employeeName: "N/A",
    productName: "Aplicativo da Loja",
    type: "Produto",
  },
  {
    id: 5,
    customerId: 104,
    customerName: "Daniel Mendes",
    rating: 5,
    comment: "Suporte técnico resolveu meu problema rapidamente.",
    date: "2025-07-24",
    employeeName: "Sofia Lima",
    productName: "Software de Gestão",
    type: "Atendimento",
  },
  {
    id: 6,
    customerId: 105,
    customerName: "Eduarda Rocha",
    rating: 1,
    comment: "Produto veio com defeito.",
    date: "2025-07-25",
    employeeName: "N/A",
    productName: "Cadeira Gamer Z",
    type: "Produto",
  },
  {
    id: 7,
    customerId: 106,
    customerName: "Fábio Almeida",
    rating: 4,
    comment: "O ambiente da empresa é muito agradável.",
    date: "2025-07-26",
    employeeName: "N/A",
    productName: "N/A",
    type: "Empresa",
  },
];

const RatingStars = ({
  rating,
  interactive = false,
  onRate,
  size = "md",
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}) => {
  const starSize =
    size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-8 h-8";
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRate?.(i + 1)}
        />
      ))}
    </div>
  );
};

const ITEMS_PER_PAGE = 5;

export const FeedbacksPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customers, getCustomerById } = useCustomer();
  const { products, getProductById } = useProduct();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState("");

  const [formState, setFormState] = useState({
    rating: 5,
    comment: "",
    employeeName: "",
    type: "Atendimento" as Feedback["type"],
  });

  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "all",
    rating: 0,
    startDate: "",
    endDate: "",
  });
  // --- ESTADO PARA PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const { newCustomerId, newProductId } = location.state || {};
    if (newCustomerId) {
      const customer = getCustomerById(newCustomerId);
      if (customer) setSelectedCustomer(customer);
    }
    if (newProductId) {
      const product = getProductById(newProductId);
      if (product) setSelectedProduct(product);
    }
    if (newCustomerId || newProductId)
      window.history.replaceState({}, document.title);
  }, [location.state, getCustomerById, getProductById]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearchTerm) return [];
    return customers.filter((c) =>
      c.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
    );
  }, [customerSearchTerm, customers]);

  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [productSearchTerm, products]);

  const filteredFeedbacks = useMemo(() => {
    setCurrentPage(1); // Reseta a página ao aplicar filtros
    return feedbacks.filter((fb) => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const matchSearch = filters.searchTerm
        ? fb.customerName.toLowerCase().includes(searchTermLower) ||
          fb.productName.toLowerCase().includes(searchTermLower) ||
          fb.employeeName.toLowerCase().includes(searchTermLower) ||
          fb.comment.toLowerCase().includes(searchTermLower)
        : true;

      const matchType =
        filters.type !== "all" ? fb.type === filters.type : true;
      const matchRating =
        filters.rating > 0 ? fb.rating === filters.rating : true;
      const matchStartDate = filters.startDate
        ? new Date(fb.date) >= new Date(filters.startDate)
        : true;
      const matchEndDate = filters.endDate
        ? new Date(fb.date) <= new Date(filters.endDate)
        : true;

      return (
        matchSearch &&
        matchType &&
        matchRating &&
        matchStartDate &&
        matchEndDate
      );
    });
  }, [feedbacks, filters]);

  // --- DADOS PAGINADOS ---
  const paginatedFeedbacks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFeedbacks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFeedbacks, currentPage]);

  const totalPages = Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE);

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      type: "all",
      rating: 0,
      startDate: "",
      endDate: "",
    });
  };

  const clearForm = () => {
    setSelectedCustomer(null);
    setCustomerSearchTerm("");
    setSelectedProduct(null);
    setProductSearchTerm("");
    setFormState({
      rating: 5,
      comment: "",
      employeeName: "",
      type: "Atendimento",
    });
  };

  const handleDeleteFeedback = (idToDelete: number) => {
    if (window.confirm("Tem certeza que deseja excluir este feedback?")) {
      setFeedbacks((current) => current.filter((fb) => fb.id !== idToDelete));
    }
  };

  const handleAddFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedProduct) {
      setAlerta({
        tipo: "danger",
        mensagem: "Selecione um cliente e um produto.",
      });
      return;
    }
    if (!formState.comment.trim() || !formState.employeeName.trim()) {
      setAlerta({
        tipo: "danger",
        mensagem: "Preencha os campos de atendente e comentário.",
      });
      return;
    }

    const newFeedback: Feedback = {
      id: Math.random(),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      productName: selectedProduct.name,
      rating: formState.rating,
      comment: formState.comment,
      employeeName: formState.employeeName,
      type: formState.type,
      date: new Date().toISOString().split("T")[0],
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    clearForm();
    setAlerta({
      tipo: "success",
      mensagem: "Feedback adicionado com sucesso!",
    });
    setTimeout(() => setAlerta(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Gestão de Feedbacks</h1>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {alerta && (
            <div
              className={`p-3 rounded-md mb-4 text-sm ${
                alerta.tipo === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {alerta.mensagem}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                1. Cliente
              </label>
              {!selectedCustomer ? (
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    placeholder="Busque o cliente..."
                    className="pl-9"
                  />
                  {customerSearchTerm && (
                    <ul className="border rounded-md max-h-32 overflow-y-auto bg-white z-10 absolute w-full shadow-lg">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((c) => (
                          <li
                            key={c.id}
                            onClick={() => {
                              setSelectedCustomer(c);
                              setCustomerSearchTerm("");
                            }}
                            className="p-2 hover:bg-primary/10 cursor-pointer"
                          >
                            {c.name}
                          </li>
                        ))
                      ) : (
                        <div className="p-2 text-center text-gray-500">
                          <p className="text-sm">Cliente não encontrado.</p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0"
                            onClick={() =>
                              navigate("/customers", {
                                state: { from: "/feedbacks" },
                              })
                            }
                          >
                            Cadastrar Novo Cliente
                          </Button>
                        </div>
                      )}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="p-2 bg-muted rounded-md flex justify-between items-center">
                  <span className="font-medium">{selectedCustomer.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                2. Produto
              </label>
              {!selectedProduct ? (
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    placeholder="Busque o produto..."
                    className="pl-9"
                  />
                  {productSearchTerm && (
                    <ul className="border rounded-md max-h-32 overflow-y-auto bg-white z-10 absolute w-full shadow-lg">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                          <li
                            key={p.id}
                            onClick={() => {
                              setSelectedProduct(p);
                              setProductSearchTerm("");
                            }}
                            className="p-2 hover:bg-primary/10 cursor-pointer"
                          >
                            {p.name}
                          </li>
                        ))
                      ) : (
                        <div className="p-2 text-center text-gray-500">
                          <p className="text-sm">Produto não encontrado.</p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0"
                            onClick={() =>
                              navigate("/products", {
                                state: { from: "/feedbacks" },
                              })
                            }
                          >
                            Cadastrar Novo Produto
                          </Button>
                        </div>
                      )}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="p-2 bg-muted rounded-md flex justify-between items-center">
                  <span className="font-medium">{selectedProduct.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedProduct(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {selectedCustomer && selectedProduct && (
            <form
              onSubmit={handleAddFeedback}
              className="space-y-6 pt-6 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium">Atendente</label>
                  <Input
                    type="text"
                    value={formState.employeeName}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        employeeName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tipo</label>
                  <Select
                    value={formState.type}
                    onValueChange={(v: Feedback["type"]) =>
                      setFormState({ ...formState, type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Atendimento">Atendimento</SelectItem>
                      <SelectItem value="Produto">Produto</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Avaliação
                  </label>
                  <RatingStars
                    rating={formState.rating}
                    interactive
                    onRate={(r) => setFormState({ ...formState, rating: r })}
                    size="lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">
                    Comentário
                  </label>
                  <Textarea
                    rows={4}
                    value={formState.comment}
                    onChange={(e) =>
                      setFormState({ ...formState, comment: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="text-right">
                <Button type="submit">Guardar Feedback</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedbacks Recebidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-gray-50 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="text-sm font-medium">Buscar</label>
                <Input
                  placeholder="Nome, produto, atendente..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={filters.type}
                  onValueChange={(v) => handleFilterChange("type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Atendimento">Atendimento</SelectItem>
                    <SelectItem value="Produto">Produto</SelectItem>
                    <SelectItem value="Empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Nota</label>
                <div className="flex items-center justify-around p-2 bg-white border rounded-md">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <Star
                      key={r}
                      className={`cursor-pointer w-6 h-6 ${
                        filters.rating === r
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                      onClick={() =>
                        handleFilterChange(
                          "rating",
                          filters.rating === r ? 0 : r
                        )
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Data Início</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Data Fim</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4 text-right">
                <Button variant="ghost" onClick={clearFilters}>
                  <FilterX className="w-4 h-4 mr-2" /> Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {paginatedFeedbacks.map((fb) => (
              <div key={fb.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-bold text-lg">
                        {fb.customerName}
                      </span>
                      <RatingStars rating={fb.rating} size="sm" />
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      "{fb.comment}"
                    </p>
                    <div className="text-xs text-gray-500 mt-3 space-x-4">
                      <span>
                        <User className="inline w-3 h-3 mr-1" />
                        Atendente: {fb.employeeName}
                      </span>
                      <span>
                        <ShoppingBag className="inline w-3 h-3 mr-1" />
                        Produto: {fb.productName}
                      </span>
                      <span>
                        <Building className="inline w-3 h-3 mr-1" />
                        Tipo: {fb.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(fb.date).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFeedback(fb.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredFeedbacks.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhum feedback corresponde aos filtros selecionados.
              </p>
            )}
          </div>

          {/* --- CONTROLES DE PAGINAÇÃO -- */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
