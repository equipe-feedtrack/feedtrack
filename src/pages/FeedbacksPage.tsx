// src/pages/FeedbacksPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomer, Customer } from '../contexts/CustomerContext'; 
// 1. IMPORTANDO O CONTEXTO DE PRODUTOS
import { useProduct, Product } from '../contexts/ProductContext';

import { Star, MessageSquarePlus, Trash2, User, ShoppingBag, Building, Search, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Feedback = { id: number; customerId: number; customerName: string; rating: number; comment: string; date: string; employeeName: string; productName: string; type: "Atendimento" | "Produto" | "Empresa"; };
type Alerta = { tipo: "success" | "danger"; mensagem: string; };

const initialFeedbacks: Feedback[] = [
  { id: 1, customerId: 101, customerName: "Ana Silva", rating: 5, comment: "Atendimento excelente.", date: "2025-07-20", employeeName: "João Martins", productName: "Smartphone X", type: "Atendimento" },
];

const RatingStars = ({ rating }: { rating: number }) => ( <div className="flex"> {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />)} </div> );

export const FeedbacksPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customers, getCustomerById } = useCustomer();
  // 2. USANDO O CONTEXTO E ADICIONANDO NOVOS ESTADOS PARA PRODUTOS
  const { products, getProductById } = useProduct();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState("");

  const [formState, setFormState] = useState({
    rating: 5, comment: "", employeeName: "", type: "Atendimento" as Feedback['type']
  });

  // 3. useEffect ATUALIZADO PARA LIDAR COM PRODUTOS E CLIENTES
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
    if (newCustomerId || newProductId) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state, getCustomerById, getProductById]);
  
  const filteredCustomers = useMemo(() => {
    if (!customerSearchTerm) return [];
    return customers.filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()));
  }, [customerSearchTerm, customers]);

  // 4. LÓGICA DE BUSCA PARA PRODUTOS
  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) return [];
    return products.filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase()));
  }, [productSearchTerm, products]);

  const clearForm = () => {
    setSelectedCustomer(null);
    setCustomerSearchTerm("");
    setSelectedProduct(null);
    setProductSearchTerm("");
    setFormState({ rating: 5, comment: "", employeeName: "", type: "Atendimento" });
  };

  const handleDeleteFeedback = (idToDelete: number) => {
    if (window.confirm("Tem certeza que deseja excluir este feedback?")) {
      setFeedbacks(current => current.filter(fb => fb.id !== idToDelete));
    }
  };
  
  const handleAddFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedProduct) {
      setAlerta({ tipo: "danger", mensagem: "Selecione um cliente e um produto." });
      return;
    }
    if (!formState.comment.trim() || !formState.employeeName.trim()) {
      setAlerta({ tipo: "danger", mensagem: "Preencha os campos de atendente e comentário." });
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
    setAlerta({ tipo: "success", mensagem: "Feedback adicionado com sucesso!" });
    setTimeout(() => setAlerta(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Gestão de Feedbacks</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Adicionar Feedback</h2>
        {alerta && <div className={`p-3 rounded-md mb-4 text-sm ${alerta.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{alerta.mensagem}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* SELEÇÃO DE CLIENTE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">1. Cliente</label>
            {!selectedCustomer ? (
              <div className="space-y-1 mt-1">
                <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="text" value={customerSearchTerm} onChange={e => setCustomerSearchTerm(e.target.value)} placeholder="Busque o cliente..." className="pl-9" /></div>
                {customerSearchTerm && <ul className="border rounded-md max-h-32 overflow-y-auto">{filteredCustomers.length > 0 ? (filteredCustomers.map(c => <li key={c.id} onClick={() => setSelectedCustomer(c)} className="p-2 hover:bg-primary/10 cursor-pointer">{c.name}</li>)) : (<div className="p-2 text-center text-gray-500"><p className="text-sm">Cliente não encontrado.</p><Button variant="link" size="sm" className="h-auto p-0" onClick={() => navigate('/customers', { state: { from: '/feedbacks' } })}>Cadastrar Novo Cliente</Button></div>)}</ul>}
              </div>
            ) : (
              <div className="mt-1 p-2 bg-muted rounded-md flex justify-between items-center"><span className="font-medium">{selectedCustomer.name}</span><Button type="button" variant="ghost" size="icon" onClick={() => setSelectedCustomer(null)}><X className="w-4 h-4" /></Button></div>
            )}
          </div>
          {/* 5. O CAMPO DE "PRODUTO" FOI SUBSTITUÍDO POR ESTE NOVO BLOCO INTELIGENTE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">2. Produto</label>
            {!selectedProduct ? (
              <div className="space-y-1 mt-1">
                <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="text" value={productSearchTerm} onChange={e => setProductSearchTerm(e.target.value)} placeholder="Busque o produto..." className="pl-9" /></div>
                {productSearchTerm && <ul className="border rounded-md max-h-32 overflow-y-auto">{filteredProducts.length > 0 ? (filteredProducts.map(p => <li key={p.id} onClick={() => setSelectedProduct(p)} className="p-2 hover:bg-primary/10 cursor-pointer">{p.name}</li>)) : (<div className="p-2 text-center text-gray-500"><p className="text-sm">Produto não encontrado.</p><Button variant="link" size="sm" className="h-auto p-0" onClick={() => navigate('/products', { state: { from: '/feedbacks' } })}>Cadastrar Novo Produto</Button></div>)}</ul>}
              </div>
            ) : (
              <div className="mt-1 p-2 bg-muted rounded-md flex justify-between items-center"><span className="font-medium">{selectedProduct.name}</span><Button type="button" variant="ghost" size="icon" onClick={() => setSelectedProduct(null)}><X className="w-4 h-4" /></Button></div>
            )}
          </div>
        </div>

        {/* O formulário só aparece quando cliente e produto estão selecionados */}
        {(selectedCustomer && selectedProduct) && (
          <form onSubmit={handleAddFeedback} className="space-y-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium">Atendente</label><Input type="text" value={formState.employeeName} onChange={e => setFormState({...formState, employeeName: e.target.value})} /></div>
              <div><label className="block text-sm font-medium">Tipo</label><Select value={formState.type} onValueChange={(v: Feedback['type']) => setFormState({...formState, type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Atendimento">Atendimento</SelectItem><SelectItem value="Produto">Produto</SelectItem><SelectItem value="Empresa">Empresa</SelectItem></SelectContent></Select></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium">Avaliação</label><div className="flex justify-center p-2">{[...Array(5)].map((_, i) => <Star key={i} onClick={() => setFormState({...formState, rating: i + 1})} className={`w-8 h-8 cursor-pointer ${i < formState.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />)}</div></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium">Comentário</label><Textarea rows={4} value={formState.comment} onChange={e => setFormState({...formState, comment: e.target.value})} /></div>
            </div>
            <div className="text-right"><Button type="submit">Guardar Feedback</Button></div>
          </form>
        )}
      </div>

      {/* LISTA DE FEEDBACKS */}
      <div className="space-y-4">
        {/* ... (o JSX da lista de feedbacks permanece o mesmo) ... */}
      </div>
    </div>
  );
};