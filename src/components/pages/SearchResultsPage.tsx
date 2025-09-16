import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, DollarSign, Upload, ArrowLeft, SlidersHorizontal, Award, ThumbsUp, Heart } from 'lucide-react';

// 1. IMPORTAMOS O MODAL DE UPLOAD QUE CRIAMOS
import UploadPrescriptionModal from './UploadPrescriptionModal';

// Interface para os "Props" - as informações que a página vai receber
interface SearchResultsPageProps {
  searchTerm: string;
  onBack: () => void;
  onSelectService: (service: any) => void;
}

// --- Dados de Exemplo (Temporários) ---
const mockResults = [
  {
    id: '1',
    partnerName: 'Laboratório Diagnóstico Plus',
    logo: 'https://via.placeholder.com/40',
    price: 180.00,
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    distance: '2.5 km',
    rating: 4.9,
    reviews: 203,
  },
  {
    id: '2',
    partnerName: 'Clínica CardioVida',
    logo: 'https://via.placeholder.com/40',
    price: 280.00,
    address: 'R. Augusta, 500 - São Paulo, SP',
    distance: '1.8 km',
    rating: 4.8,
    reviews: 127,
  },
  {
    id: '3',
    partnerName: 'Fisio Center',
    logo: 'https://via.placeholder.com/40',
    price: 120.00,
    address: 'Al. Santos, 2200 - São Paulo, SP',
    distance: '3.1 km',
    rating: 4.7,
    reviews: 94,
  },
];

export default function SearchResultsPage({ searchTerm, onBack, onSelectService }: SearchResultsPageProps) {
  const [results, setResults] = useState(mockResults);
  const [sortBy, setSortBy] = useState('relevance');
  
  // 2. NOVO ESTADO PARA CONTROLAR A JANELA DE UPLOAD
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  useEffect(() => {
    let sortedResults = [...mockResults];
    if (sortBy === 'price') {
      sortedResults.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      sortedResults.sort((a, b) => b.rating - a.rating);
    }
    setResults(sortedResults);
  }, [sortBy]);
  
  // Função para lidar com o arquivo após o upload
  const handleFileUpload = (file: File) => {
      alert(`Arquivo "${file.name}" enviado com sucesso! Ele será associado ao seu pedido.`);
      // Aqui, no futuro, a lógica enviaria o arquivo para o servidor.
  };


  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
              <button onClick={onBack} className="text-gray-500 hover:text-gray-800">
                  <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                      type="text"
                      defaultValue={searchTerm}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
              </div>
              {/* 3. BOTÃO AGORA ABRE A JANELA DE UPLOAD */}
               <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
               >
                  <Upload className="w-4 h-4" />
                  <span>Anexar Pedido</span>
              </button>
          </div>

          <div>
              <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                      {results.length} resultados encontrados para "{searchTerm}"
                  </h2>
                  <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                      <button 
                          onClick={() => setSortBy('relevance')}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${sortBy === 'relevance' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'}`}>
                          Relevância
                      </button>
                       <button 
                          onClick={() => setSortBy('price')}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${sortBy === 'price' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'}`}>
                          Menor Preço
                      </button>
                       <button 
                          onClick={() => setSortBy('rating')}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${sortBy === 'rating' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'}`}>
                          Maior Avaliação
                      </button>
                  </div>
              </div>
          </div>

          <div className="space-y-4">
            {results.map(partner => (
              <div key={partner.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start gap-6 hover:border-emerald-400 transition-all">
                  <div className='flex items-center gap-4 sm:w-1/3'>
                      <img src={partner.logo} alt={partner.partnerName} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                          <h3 className="font-bold text-gray-900">{partner.partnerName}</h3>
                          <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold text-gray-800">{partner.rating}</span>
                              <span className="text-sm text-gray-500">({partner.reviews} avaliações)</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex-grow">
                      <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{partner.address}</span>
                      </div>
                      <a href="#" className="text-sm text-emerald-600 font-medium mt-1 inline-block">Ver no mapa ({partner.distance})</a>
                  </div>

                  <div className="text-right w-full sm:w-auto">
                      <p className="text-sm text-gray-600">a partir de</p>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(partner.price)}</p>
                      <button 
                          onClick={() => onSelectService(partner)}
                          className="w-full bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                      >
                          Ver detalhes
                      </button>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 4. A JANELA DE UPLOAD É EXIBIDA AQUI QUANDO SOLICITADA */}
      {isUploadModalOpen && (
          <UploadPrescriptionModal 
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={handleFileUpload}
          />
      )}
    </>
  );
}