import React from 'react';
import { ArrowLeft, User, CreditCard, QrCode, Barcode, Shield } from 'lucide-react';

// Interface para os "Props" - as informações que a página vai receber
interface CheckoutPageProps {
  cartItems: any[]; // A lista de itens no carrinho para o resumo
  onBack: () => void; // Função para voltar ao carrinho
  onConfirmPayment: (paymentMethod: string) => void; // Função para confirmar o pedido
}

export default function CheckoutPage({ cartItems, onBack, onConfirmPayment }: CheckoutPageProps) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const total = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* --- Cabeçalho --- */}
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-600 p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Finalizar Compra</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* --- Coluna Esquerda: Detalhes do Pagamento --- */}
            <div className="space-y-6">
                {/* Dados do Paciente */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-600" />
                        Seus Dados
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p><span className="font-semibold text-gray-600">Nome:</span> Paciente Teste</p>
                        <p><span className="font-semibold text-gray-600">CPF:</span> 123.456.789-00</p>
                        <p><span className="font-semibold text-gray-600">E-mail:</span> paciente@docton.com</p>
                    </div>
                </div>

                {/* Método de Pagamento */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                        Forma de Pagamento
                    </h2>
                    <div className="space-y-3">
                        {/* Opção PIX */}
                        <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                            <QrCode className="w-6 h-6 text-gray-600" />
                            <span className="font-semibold flex-grow">PIX</span>
                            <input type="radio" name="paymentMethod" value="pix" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"/>
                        </label>
                         {/* Opção Cartão de Crédito */}
                        <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                            <CreditCard className="w-6 h-6 text-gray-600" />
                            <span className="font-semibold flex-grow">Cartão de Crédito</span>
                            <input type="radio" name="paymentMethod" value="card" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"/>
                        </label>
                         {/* Opção Boleto */}
                        <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                            <Barcode className="w-6 h-6 text-gray-600" />
                            <span className="font-semibold flex-grow">Boleto Bancário</span>
                            <input type="radio" name="paymentMethod" value="boleto" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"/>
                        </label>
                    </div>
                </div>
            </div>

            {/* --- Coluna Direita: Resumo do Pedido --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-800">Resumo da Compra</h2>
                <div className="space-y-2 border-b pb-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-700">
                            <span>{item.serviceName}</span>
                            <span className="font-medium">{formatCurrency(item.price)}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between font-bold text-xl text-gray-800">
                    <span>Total a pagar</span>
                    <span>{formatCurrency(total)}</span>
                </div>
                <button 
                    onClick={() => onConfirmPayment('pix')} // Apenas um exemplo, será dinâmico
                    className="w-full bg-emerald-500 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors">
                    Confirmar e Pagar
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-2">
                    <Shield className="w-4 h-4" />
                    <span>Ambiente 100% seguro.</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}