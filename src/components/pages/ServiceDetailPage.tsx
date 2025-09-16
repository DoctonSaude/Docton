import React from 'react';
import { ArrowLeft, Clock, DollarSign, FileText, Check, Star, MapPin, Phone, Globe, Heart, ShoppingCart } from 'lucide-react';

interface ServiceDetailPageProps {
  service: any; 
  onBack: () => void;
  onAddToCart: (service: any) => void;
}

// Dados de exemplo para o caso de a página ser aberta diretamente (sem dados)
const mockServiceDetails = {
  id: 'Hemo-1',
  serviceName: 'Hemograma Completo',
  partnerName: 'Laboratório Diagnóstico Plus',
  price: 180.00,
  description: 'O Hemograma Completo é um exame de sangue que avalia as células sanguíneas...',
  preparation: [
    'Jejum de 8 horas é recomendado, mas não obrigatório.',
    'Não ingerir bebida alcoólica 24 horas antes do exame.',
    'Evitar exercícios físicos intensos na véspera.',
    'Apresentar documento de identificação com foto e o pedido médico.',
  ],
  logo: 'https://via.placeholder.com/80',
  address: 'Av. Paulista, 1000 - Bela Vista, São Paulo, SP',
  phone: '(11) 4004-1000',
  website: 'www.diagnosticoplus.com.br',
  rating: 4.9,
  reviews: 203,
  photos: [
      'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3993212/pexels-photo-3993212.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/7578859/pexels-photo-7578859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ]
};


export default function ServiceDetailPage({ service, onBack, onAddToCart }: ServiceDetailPageProps) {
  // Se nenhum serviço foi passado, usamos os dados de exemplo. Senão, usamos os dados do serviço clicado.
  const currentService = service || mockServiceDetails;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  // CORREÇÃO: Verificamos se 'currentService.photos' existe antes de tentar usá-lo.
  const photos = currentService.photos || mockServiceDetails.photos;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-600 p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{currentService.serviceName || "Detalhes do Serviço"}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-3 gap-2">
                {/* CORREÇÃO: Usamos a variável 'photos' que já foi verificada. */}
              <img src={photos[0]} alt="Foto 1" className="col-span-3 h-64 w-full object-cover rounded-xl" />
              <img src={photos[1]} alt="Foto 2" className="h-32 w-full object-cover rounded-xl" />
              <img src={photos[2]} alt="Foto 3" className="h-32 w-full object-cover rounded-xl" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-emerald-600" />
                Sobre o Serviço
              </h2>
              <p className="text-gray-600 leading-relaxed">{currentService.description}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Check className="text-emerald-600" />
                Preparo Necessário
              </h2>
              <ul className="space-y-3">
                {currentService.preparation && currentService.preparation.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-6">
              <div className="flex items-center gap-4 mb-4">
                 {/* CORREÇÃO: Acessando o logo diretamente. */}
                <img src={currentService.logo} alt={currentService.partnerName} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{currentService.partnerName}</h3>
                     <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-800">{currentService.rating}</span>
                        <span className="text-sm text-gray-500">({currentService.reviews} avaliações)</span>
                    </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700 border-t pt-4">
                 {/* CORREÇÃO: Acessando o endereço e outras infos diretamente. */}
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500"/>
                    <span>{currentService.address}</span>
                </div>
                <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-0.5 text-gray-500"/>
                    <span>{currentService.phone}</span>
                </div>
                 <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 mt-0.5 text-gray-500"/>
                    <a href="#" className="text-emerald-600 hover:underline">{currentService.website}</a>
                </div>
              </div>

              <div className="border-t mt-6 pt-6">
                <div className="flex items-baseline justify-between mb-4">
                    <span className="text-gray-600">Preço</span>
                    <span className="text-3xl font-bold text-gray-900">{formatCurrency(currentService.price)}</span>
                </div>
                <button 
                  onClick={() => onAddToCart(currentService)}
                  className="w-full bg-emerald-500 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Adicionar ao Carrinho
                </button>
                 <button className="w-full mt-2 bg-emerald-50 text-emerald-700 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold hover:bg-emerald-100 transition-colors">
                    <Heart className="w-5 h-5" />
                    Salvar para depois
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}