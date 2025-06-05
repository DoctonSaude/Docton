import React, { useState } from 'react';
import { Plus, ChevronRight, Activity, Heart, Droplets, LineChart } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { mockHealthMetrics } from '../../mocks/healthMetrics';
import { HealthMetric } from '../../types';

export const HealthTrackingPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'bloodPressure' | 'bloodGlucose' | 'weight'>('all');
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [newMetric, setNewMetric] = useState<Partial<HealthMetric>>({
    type: 'bloodPressure',
    value: '',
    unit: 'mmHg',
    notes: ''
  });
  
  if (!user || user.role !== 'patient') {
    return <div>Carregando...</div>;
  }
  
  // Filter metrics based on active tab and patient ID
  const filteredMetrics = mockHealthMetrics
    .filter(m => m.patientId === user.id)
    .filter(m => activeTab === 'all' || m.type === activeTab)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Group metrics by date
  const groupedMetrics: {[key: string]: HealthMetric[]} = {};
  
  filteredMetrics.forEach(metric => {
    const date = metric.timestamp.toLocaleDateString('pt-BR');
    if (!groupedMetrics[date]) {
      groupedMetrics[date] = [];
    }
    groupedMetrics[date].push(metric);
  });
  
  // Get the latest metrics for each type
  const latestMetrics = {
    bloodPressure: mockHealthMetrics
      .filter(m => m.patientId === user.id && m.type === 'bloodPressure')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0],
    bloodGlucose: mockHealthMetrics
      .filter(m => m.patientId === user.id && m.type === 'bloodGlucose')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0],
    weight: mockHealthMetrics
      .filter(m => m.patientId === user.id && m.type === 'weight')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMetric(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddMetric = () => {
    // In a real app, this would make an API call
    console.log('Adding new metric:', newMetric);
    setIsAddingMetric(false);
    setNewMetric({
      type: 'bloodPressure',
      value: '',
      unit: 'mmHg',
      notes: ''
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Acompanhamento de saúde</h1>
        <Button 
          leftIcon={<Plus size={18} />}
          onClick={() => setIsAddingMetric(true)}
        >
          Registrar métrica
        </Button>
      </div>
      
      {/* Health overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full flex items-center justify-center">
            <Heart size={28} className="text-red-500 ml-1 mb-1" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Pressão Arterial</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {latestMetrics.bloodPressure?.value || '--/--'}
            </span>
            <span className="ml-1 text-sm text-gray-500">mmHg</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {latestMetrics.bloodPressure 
              ? `Última medição: ${new Date(latestMetrics.bloodPressure.timestamp).toLocaleDateString('pt-BR')}` 
              : 'Nenhum registro encontrado'}
          </p>
        </Card>
        
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full flex items-center justify-center">
            <Droplets size={28} className="text-blue-500 ml-1 mb-1" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Glicemia</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {latestMetrics.bloodGlucose?.value || '--'}
            </span>
            <span className="ml-1 text-sm text-gray-500">mg/dL</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {latestMetrics.bloodGlucose 
              ? `Última medição: ${new Date(latestMetrics.bloodGlucose.timestamp).toLocaleDateString('pt-BR')}` 
              : 'Nenhum registro encontrado'}
          </p>
        </Card>
        
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full flex items-center justify-center">
            <Activity size={28} className="text-green-500 ml-1 mb-1" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Peso</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {latestMetrics.weight?.value || '--'}
            </span>
            <span className="ml-1 text-sm text-gray-500">kg</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {latestMetrics.weight 
              ? `Última medição: ${new Date(latestMetrics.weight.timestamp).toLocaleDateString('pt-BR')}` 
              : 'Nenhum registro encontrado'}
          </p>
        </Card>
      </div>
      
      {/* Chart card - In a real app, this would use a charting library */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Acompanhamento</h3>
          <div className="flex items-center">
            <Button 
              size="sm" 
              variant={activeTab === 'bloodPressure' ? 'primary' : 'outline'}
              className="mr-2"
              onClick={() => setActiveTab('bloodPressure')}
            >
              Pressão
            </Button>
            <Button 
              size="sm" 
              variant={activeTab === 'bloodGlucose' ? 'primary' : 'outline'}
              className="mr-2"
              onClick={() => setActiveTab('bloodGlucose')}
            >
              Glicemia
            </Button>
            <Button 
              size="sm" 
              variant={activeTab === 'weight' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('weight')}
            >
              Peso
            </Button>
          </div>
        </div>
        
        <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <LineChart size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Gráfico de acompanhamento</p>
            <p className="text-sm text-gray-400">(Em um app real, aqui seria exibido um gráfico de evolução)</p>
          </div>
        </div>
      </Card>
      
      {/* Metrics history */}
      <Card 
        title="Histórico de métricas" 
        subtitle="Todas as suas medições registradas"
      >
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'all' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Tudo
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'bloodPressure' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('bloodPressure')}
          >
            Pressão
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'bloodGlucose' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('bloodGlucose')}
          >
            Glicemia
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'weight' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('weight')}
          >
            Peso
          </button>
        </div>
        
        {Object.keys(groupedMetrics).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedMetrics).map(([date, metrics]) => (
              <div key={date}>
                <h3 className="font-medium text-gray-900 mb-3">{date}</h3>
                <div className="space-y-3">
                  {metrics.map(metric => (
                    <div key={metric.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            {metric.type === 'bloodPressure' && (
                              <Heart size={16} className="text-red-500 mr-2" />
                            )}
                            {metric.type === 'bloodGlucose' && (
                              <Droplets size={16} className="text-blue-500 mr-2" />
                            )}
                            {metric.type === 'weight' && (
                              <Activity size={16} className="text-green-500 mr-2" />
                            )}
                            <span className="font-medium">
                              {metric.type === 'bloodPressure' && 'Pressão Arterial'}
                              {metric.type === 'bloodGlucose' && 'Glicemia'}
                              {metric.type === 'weight' && 'Peso'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline">
                            <span className="text-lg font-semibold">{metric.value}</span>
                            {metric.unit && <span className="ml-1 text-sm text-gray-500">{metric.unit}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">
                            {new Date(metric.timestamp).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {metric.notes && (
                            <p className="text-xs text-gray-600 mt-1 max-w-xs truncate">
                              {metric.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Nenhum registro encontrado para os filtros selecionados</p>
            <Button 
              variant="secondary"
              onClick={() => setActiveTab('all')}
            >
              Ver todas as métricas
            </Button>
          </div>
        )}
      </Card>
      
      {/* Add metric modal */}
      {isAddingMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Registrar nova métrica</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de métrica
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newMetric.type}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  >
                    <option value="bloodPressure">Pressão Arterial</option>
                    <option value="bloodGlucose">Glicemia</option>
                    <option value="weight">Peso</option>
                    <option value="symptoms">Sintomas</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    value={newMetric.value}
                    onChange={handleInputChange}
                    placeholder={newMetric.type === 'bloodPressure' ? '120/80' : ''}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade
                  </label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={newMetric.unit}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newMetric.notes}
                    onChange={handleInputChange}
                    placeholder="Opcional"
                    rows={3}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => setIsAddingMetric(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  fullWidth
                  onClick={handleAddMetric}
                >
                  Salvar registro
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};