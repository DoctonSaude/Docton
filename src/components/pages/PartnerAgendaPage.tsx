import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, CheckCircle, Search } from 'lucide-react';

// --- Interface para os dados do agendamento
interface AgendaItem {
  id: string;
  date: string; // Formato YYYY-MM-DD
  time: string;
  patientName: string;
  service: string;
  status: 'confirmed' | 'arrived' | 'completed' | 'canceled';
}

// Dados de Exemplo (Temporários) com mais dias
const mockAgenda: AgendaItem[] = [
    { id: '1', date: '2025-07-14', time: '10:00', patientName: 'Gustavo Pereira', service: 'Consulta de Rotina', status: 'completed' },
    { id: '2', date: '2025-07-16', time: '09:00', patientName: 'Ana Clara Lima', service: 'Hemograma Completo', status: 'confirmed' },
    { id: '3', date: '2025-07-16', time: '09:30', patientName: 'Bruno Martins', service: 'Consulta Cardiológica', status: 'arrived' },
    { id: '4', date: '2025-07-16', time: '10:00', patientName: 'Carlos Eduardo Souza', service: 'Exame de Rotina', status: 'confirmed' },
    { id: '5', date: '2025-07-17', time: '14:00', patientName: 'Daniela Ferreira', service: 'Ultrassom Abdominal', status: 'confirmed' },
    { id: '6', date: '2025-07-18', time: '11:00', patientName: 'Fernanda Lins', service: 'Consulta de Rotina', status: 'canceled' },
    { id: '8', date: '2025-08-05', time: '16:00', patientName: 'Isabela Rocha', service: 'Consulta de Rotina', status: 'confirmed' },
];

export default function PartnerAgendaPage() {
    const [view, setView] = useState<'month' | 'week' | 'day'>('week');
    const [currentDate, setCurrentDate] = useState(new Date('2025-07-16T12:00:00Z'));
    const [searchTerm, setSearchTerm] = useState('');

    const kpis = useMemo(() => {
        const agendados = mockAgenda.filter(a => a.status === 'confirmed' || a.status === 'arrived').length;
        const atendidos = mockAgenda.filter(a => a.status === 'completed').length;
        const cancelados = mockAgenda.filter(a => a.status === 'canceled').length;
        return {
            total: mockAgenda.length,
            agendados,
            atendidos,
            cancelados
        }
    }, [mockAgenda]);

    const goToNextPeriod = () => {
        const newDate = new Date(currentDate);
        if (view === 'day') newDate.setDate(newDate.getDate() + 1);
        if (view === 'week') newDate.setDate(newDate.getDate() + 7);
        if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const goToPreviousPeriod = () => {
        const newDate = new Date(currentDate);
        if (view === 'day') newDate.setDate(newDate.getDate() - 1);
        if (view === 'week') newDate.setDate(newDate.getDate() - 7);
        if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };
    
    const getAppointmentsForDay = (day: Date) => {
        const dateString = day.toISOString().split('T')[0];
        const appointments = mockAgenda.filter(item => item.date === dateString);
        if (searchTerm) {
            return appointments.filter(item =>
                item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.service.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return appointments;
    };
    
    const renderHeader = () => {
        let headerText = '';
        if (view === 'day') {
            headerText = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        } else if (view === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            headerText = `${startOfWeek.toLocaleDateString('pt-BR', {day:'2-digit', month:'short'})} - ${endOfWeek.toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'})}`;
        } else {
             headerText = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        }
        
        return (
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={goToPreviousPeriod} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft className="w-5 h-5" /></button>
                    <h2 className="text-xl font-bold text-gray-800">{headerText}</h2>
                    <button onClick={goToNextPeriod} className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                    <button onClick={() => setView('day')} className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'day' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'}`}>Dia</button>
                    <button onClick={() => setView('week')} className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'week' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'}`}>Semana</button>
                    <button onClick={() => setView('month')} className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'month' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'}`}>Mês</button>
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const dayAppointments = getAppointmentsForDay(currentDate);
        return (
            <div className="space-y-4">
                {dayAppointments.length > 0 ? dayAppointments.map(item => (
                     <div key={item.id} className="flex items-center gap-4 p-4 border-l-4 rounded-r-lg bg-white border-emerald-500 shadow-sm">
                        <div className="text-center w-20"><p className="font-bold text-lg text-emerald-700">{item.time}</p></div>
                        <div className="border-l border-gray-200 pl-4 flex-grow"><p className="font-semibold text-gray-800">{item.patientName}</p><p className="text-sm text-gray-600">{item.service}</p></div>
                     </div>
                )) : (
                    <div className="text-center py-10 text-gray-500"><Calendar className="mx-auto w-12 h-12 text-gray-300 mb-4" /><p>Nenhum agendamento para este dia.</p></div>
                )}
            </div>
        );
    };

    const renderWeekView = () => {
        const weekDays = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-gray-200 border border-gray-200">
                {weekDays.map((day, index) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    return (
                        <div key={index} className="bg-gray-50 p-2 min-h-[200px]">
                            <p className="font-bold text-center text-sm text-gray-700">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                            <p className="font-semibold text-center text-lg text-emerald-600 mb-2">{day.getDate()}</p>
                            <div className="space-y-2">
                                {dayAppointments.map(item => (
                                    <div key={item.id} className="bg-white p-2 rounded-lg shadow-sm text-xs">
                                        <p className="font-bold">{item.time}</p>
                                        <p>{item.patientName}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const calendarDays = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="border border-gray-200 bg-gray-50"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const appointmentsForDay = getAppointmentsForDay(date);
            const isToday = new Date().toDateString() === date.toDateString();
            
            calendarDays.push(
                <div key={day} className={`p-2 border border-gray-200 min-h-[120px] ${isToday ? 'bg-emerald-50' : 'bg-white'}`}>
                    <button 
                      onClick={() => { setCurrentDate(date); setView('day'); }}
                      className={`font-semibold ${isToday ? 'text-emerald-600' : 'text-gray-700'}`}
                    >
                        {day}
                    </button>
                    <div className="mt-1 space-y-1">
                        {appointmentsForDay.map(apt => (
                            <div key={apt.id} className="text-xs p-1 bg-blue-100 text-blue-800 rounded-md truncate" title={`${apt.time} - ${apt.patientName}`}>
                                {apt.patientName}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-600 py-2 border-b-2">{day}</div>
                ))}
                {calendarDays}
            </div>
        );
    };


    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Calendar className="w-6 h-6" />Agenda Docton</h1>
                    <p className="text-gray-500">Visualize e gerencie todos os agendamentos da plataforma.</p>
                </div>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Buscar por paciente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"/>
                 </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Total de Agendamentos</p><p className="text-3xl font-bold text-black mt-2">{kpis.total}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Agendados</p><p className="text-3xl font-bold text-blue-600 mt-2">{kpis.agendados}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Atendidos</p><p className="text-3xl font-bold text-green-600 mt-2">{kpis.atendidos}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Cancelados</p><p className="text-3xl font-bold text-red-600 mt-2">{kpis.cancelados}</p></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
                {renderHeader()}
                {view === 'month' && renderMonthView()}
                {view === 'week' && renderWeekView()}
                {view === 'day' && renderDayView()}
            </div>
        </div>
    );
}