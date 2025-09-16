import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Users,
  CheckCircle,
  DollarSign,
  Search,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';

// CORREÇÃO AQUI: Importamos os nomes corretos das funções.
import { 
    getAppointmentStatusColor, 
    getStatusIcon, 
    translateAppointmentStatus 
} from '../../utils/appointmentUtils';

export default function AppointmentsList() {
  const { 
    appointments, 
    isLoading, 
    refreshAppointments, 
    updateAppointment 
  } = useAppointments('partner-id-placeholder');

  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [filters, setFilters] = useState({
    status: 'all', dateRange: 'all', search: '', provider: 'all'
  });

  useEffect(() => {
    let filtered = appointments;
    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.clientName.toLowerCase().includes(searchLower) ||
        apt.serviceName.toLowerCase().includes(searchLower)
      );
    }
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredAppointments(filtered);
  }, [appointments, filters]);

  const exportAppointments = () => {
    console.log("Exportando dados...");
  };

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      today: appointments.filter(apt => new Date(apt.date).toDateString() === new Date().toDateString()).length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      revenue: appointments.filter(apt => apt.status === 'completed').reduce((sum, apt) => sum + apt.price, 0)
    };
  }, [appointments]);
  
    if (isLoading && appointments.length === 0) {
        return <div className="text-center p-10"><RefreshCw className="animate-spin mx-auto" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Agendamentos</h1>
                <p className="text-emerald-100">Gerencie todos os agendamentos da plataforma</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center justify-between"><div><p className="text-gray-600 text-sm">Hoje</p><p className="text-2xl font-bold text-blue-600">{stats.today}</p></div><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-600" /></div></div></div>
                 <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center justify-between"><div><p className="text-gray-600 text-sm">Confirmados</p><p className="text-2xl font-bold text-green-600">{stats.confirmed}</p></div><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div></div></div>
                 <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center justify-between"><div><p className="text-gray-600 text-sm">Total</p><p className="text-2xl font-bold text-purple-600">{stats.total}</p></div><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-purple-600" /></div></div></div>
                 <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center justify-between"><div><p className="text-gray-600 text-sm">Receita (Concluídos)</p><p className="text-2xl font-bold text-emerald-600">R$ {stats.revenue.toFixed(2)}</p></div><div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"><DollarSign className="w-6 h-6 text-emerald-600" /></div></div></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Buscar cliente, serviço..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className="w-full pl-10 p-2 border rounded-lg" />
                    </div>
                    <div>
                        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full p-2 border rounded-lg">
                            <option value="all">Todos os Status</option>
                            <option value="scheduled">Agendado</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="completed">Concluído</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>
                    <div>
                         <button onClick={exportAppointments} className="w-full p-2 bg-emerald-500 text-white rounded-lg flex items-center justify-center space-x-2"><Download className="w-4 h-4"/><span>Exportar</span></button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAppointments.map(apt => {
                                const StatusIcon = getStatusIcon(apt.status);
                                return (
                                <tr key={apt.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4"><div className="font-medium">{apt.clientName}</div><div className="text-sm text-gray-500">{apt.clientEmail}</div></td>
                                    <td className="px-6 py-4">{apt.serviceName}</td>
                                    <td className="px-6 py-4">{new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.time}</td>
                                    <td className="px-6 py-4"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(apt.status)}`}><StatusIcon className="w-3 h-3 mr-1"/>{translateAppointmentStatus(apt.status)}</span></td>
                                    <td className="px-6 py-4">
                                        {apt.status === 'scheduled' && <button onClick={() => updateAppointment(apt.id, {status: 'confirmed'})} className="text-green-600 hover:text-green-800">Confirmar</button>}
                                        {apt.status === 'confirmed' && <button onClick={() => updateAppointment(apt.id, {status: 'completed'})} className="text-blue-600 hover:text-blue-800">Concluir</button>}
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}