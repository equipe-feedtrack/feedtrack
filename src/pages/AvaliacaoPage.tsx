// src/pages/AvaliacaoPage.tsx

import { useSearchParams } from "react-router-dom";
import { useCustomer } from "@/contexts/CustomerContext";
import { useProduct } from "@/contexts/ProductContext";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importar CardHeader e CardTitle
import { useEffect, useState } from "react";
import { ThumbsUp, Package } from "lucide-react"; // Importar ícone
import { Customer } from "@/contexts/CustomerContext"; // Importar tipos
import { Product } from "@/contexts/ProductContext";

type Order = { id: string; date: string; customerId: number; productId: number; };

const findOrderById = (orderId: string): Order | null => {
  if (orderId === "12345") {
    return { id: "12345", date: "20/Jul/2025", customerId: 101, productId: 201 };
  }
  return null;
};

export const AvaliacaoPage = () => {
  const [searchParams] = useSearchParams();
  const { getCustomerById } = useCustomer();
  const { getProductById } = useProduct();

  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null); // Tipagem corrigida
  const [product, setProduct] = useState<Product | null>(null);   // Tipagem corrigida
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("pedidoId");
    if (orderId) {
      const foundOrder = findOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        setCustomer(getCustomerById(foundOrder.customerId) || null);
        setProduct(getProductById(foundOrder.productId) || null);
      }
    }
    setIsLoading(false);
  }, [searchParams, getCustomerById, getProductById]);

  // A submissão agora é tratada dentro do FeedbackForm, então não precisamos mais do 'isSubmitted'
  // nem do 'handleFeedbackSubmit' aqui. O FeedbackForm irá usar o FeedbackContext.

  if (isLoading) {
    return <div className="p-8 text-center">A carregar...</div>;
  }
  
  if (!order || !customer || !product) {
    return <div className="p-8 text-center text-red-600">Pedido de avaliação inválido ou não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 1. Adicionamos um cabeçalho para mostrar os detalhes do pedido */}
        <Card className="shadow-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl font-bold">Avalie sua Compra</CardTitle>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <p className="text-lg font-semibold text-foreground">{product.name}</p>
              <p className="text-sm">Olá, {customer.name}! Gostaríamos de saber sua opinião sobre a compra do pedido #{order.id}.</p>
            </div>
          </CardHeader>
        </Card>
        
        {/* 2. O FeedbackForm agora funciona sozinho, lendo a estrutura do FormContext */}
        <FeedbackForm />
      </div>
    </div>
  );
};