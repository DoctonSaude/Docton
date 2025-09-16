import React from 'react';
import { ArrowLeft, ShoppingCart, Trash2, Tag, CreditCard } from 'lucide-react';

interface ShoppingCartPageProps {
  cartItems: any[];
  onBack: () => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export default function ShoppingCartPage({ cartItems, onBack, onRemoveItem, onCheckout }: ShoppingCartPageProps) {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const total = subtotal;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-600 p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Meu Carrinho
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Seu carrinho está vazio.</h2>
            <p className="text-gray-500 mt-2 mb-6">Adicione serviços para poder finalizar sua compra.</p>
            <button onClick={onBack} className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600">
              Buscar serviços
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Itens do Pedido</h2>
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                  {/* CORREÇÃO AQUI: Acessamos o 'logo' diretamente do 'item' */}
                  <img src={item.logo} alt={item.partnerName} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{item.serviceName}</h3>
                    <p className="text-sm text-gray-500">{item.partnerName}</p>
                    <button onClick={() => onRemoveItem(item.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1">
                      <Trash2 className="w-3 h-3" />
                      Remover
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border sticky top-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Resumo do Pedido</h2>
              
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} {cartItems.length > 1 ? 'itens' : 'item'})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                 <div className="flex justify-between text-gray-600">
                  <span>Taxas</span>
                  <span>{formatCurrency(0)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-xl text-gray-800">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="relative">
                <input type="text" placeholder="Cupom de desconto" className="w-full p-2 border rounded-lg pl-10" />
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-emerald-500 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors">
                <CreditCard className="w-5 h-5" />
                Ir para o Pagamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}