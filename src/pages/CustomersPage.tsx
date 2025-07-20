// src/pages/CustomersPage.tsx

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomer, Customer } from "@/contexts/CustomerContext"; // Usando o contexto

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CustomersPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSegment, setFilterSegment] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const [newCustomerData, setNewCustomerData] = useState({
    name: "", email: "", phone: "", address: "", segment: "new" as Customer['segment']
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
    const matchesSegment = filterSegment === "all" || customer.segment === filterSegment;
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const handleAddCustomer = () => {
    if (!newCustomerData.name || !newCustomerData.email) {
      toast({ title: "Erro", description: "Nome e email são obrigatórios", variant: "destructive" });
      return;
    }
    const createdCustomer = addCustomer(newCustomerData);
    setNewCustomerData({ name: "", email: "", phone: "", address: "", segment: "new" });
    setIsAddDialogOpen(false);
    toast({ title: "Cliente adicionado", description: "Cliente cadastrado com sucesso!" });

    if (location.state?.from === '/feedbacks') {
      navigate('/feedbacks', { state: { newCustomerId: createdCustomer.id } });
    }
  };

  const handleSaveEdit = () => {
    if (!editingCustomer) return;
    updateCustomer(editingCustomer);
    setEditingCustomer(null);
    toast({ title: "Cliente atualizado", description: "Dados do cliente atualizados com sucesso!" });
  };

  const handleDeleteCustomer = (id: number) => {
    deleteCustomer(id);
    toast({ title: "Cliente removido", description: "Cliente removido do sistema" });
  };

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'premium': return <Badge className="bg-yellow-500 text-white">Premium</Badge>;
      case 'regular': return <Badge variant="secondary">Regular</Badge>;
      case 'new': return <Badge className="bg-green-500 text-white">Novo</Badge>;
      default: return <Badge variant="outline">{segment}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
          <p className="text-muted-foreground">Cadastre e gerencie informações dos seus clientes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Novo Cliente</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Adicionar Novo Cliente</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label htmlFor="name">Nome *</Label><Input id="name" value={newCustomerData.name} onChange={(e) => setNewCustomerData({...newCustomerData, name: e.target.value})} /></div>
              <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={newCustomerData.email} onChange={(e) => setNewCustomerData({...newCustomerData, email: e.target.value})} /></div>
              <div><Label htmlFor="phone">Telefone</Label><Input id="phone" value={newCustomerData.phone} onChange={(e) => setNewCustomerData({...newCustomerData, phone: e.target.value})} /></div>
              <div><Label htmlFor="address">Endereço</Label><Textarea id="address" value={newCustomerData.address} onChange={(e) => setNewCustomerData({...newCustomerData, address: e.target.value})} /></div>
              <div><Label htmlFor="segment">Segmento</Label><Select value={newCustomerData.segment} onValueChange={(value: Customer['segment']) => setNewCustomerData({...newCustomerData, segment: value})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="new">Novo</SelectItem><SelectItem value="regular">Regular</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select></div>
              <div className="flex gap-2"><Button onClick={handleAddCustomer} className="flex-1">Adicionar Cliente</Button><Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" />Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label htmlFor="search">Buscar</Label><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="search" placeholder="Nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div></div>
            <div><Label htmlFor="status">Status</Label><Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="active">Ativo</SelectItem><SelectItem value="inactive">Inativo</SelectItem></SelectContent></Select></div>
            <div><Label htmlFor="segment">Segmento</Label><Select value={filterSegment} onValueChange={setFilterSegment}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="new">Novo</SelectItem><SelectItem value="regular">Regular</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Clientes ({filteredCustomers.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2"><h3 className="font-semibold">{customer.name}</h3>{getSegmentBadge(customer.segment)}<Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>{customer.status === 'active' ? 'Ativo' : 'Inativo'}</Badge></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</div>
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</div>
                      <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{customer.address}</div>
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />Última compra: {customer.lastPurchase || 'Nunca'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingCustomer(customer)}><Edit className="w-3 h-3" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(customer.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingCustomer && (
        <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Cliente</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nome</Label><Input value={editingCustomer.name} onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})} /></div>
              <div><Label>Email</Label><Input value={editingCustomer.email} onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})} /></div>
              <div className="flex gap-2"><Button onClick={handleSaveEdit} className="flex-1">Salvar Alterações</Button><Button variant="outline" onClick={() => setEditingCustomer(null)}>Cancelar</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};