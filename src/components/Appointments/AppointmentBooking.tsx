import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  CalendarDays,
  Timer,
  DollarSign,
  FileText,
  Send,
  RefreshCw,
  Star
} from 'lucide-react';
import { useAppointments, TimeSlot } from '../../hooks/useAppointments'; // Importamos nosso hook

// Interface para os serviços (pode ser movida para um arquivo de tipos)
interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  description: string;
  provider: string;
  rating: number;
  reviews: number;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function AppointmentBooking() {
  // Usamos nosso hook para ter acesso às funções de agendamento
  const { createAppointment, getAvailableTimeSlots, isLoading: isSubmitting } = useAppointments();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '', clientEmail: '', clientPhone: '', notes: ''
  });

  // Mock de serviços
  const services: Service[] = [
    { id: '1', name: 'Consulta Cardiológica', duration: 60, price: 280, category: 'consultation', description: 'Consulta completa com cardiologista especializado', provider: 'Dr. João Silva - CRM 12345', rating: 4.8, reviews: 127 },
    { id: '2', name: 'Ultrassom Abdominal', duration: 30, price: 180, category: 'exam', description: 'Exame de ultrassom abdominal com laudo', provider: 'Clínica Diagnóstica Plus', rating: 4.9, reviews: 203 },
    { id: '3', name: 'Fisioterapia Ortopédica', duration: 45, price: 120, category: 'therapy', description: 'Sessão de fisioterapia especializada', provider: 'Fisio Center', rating: 4.7, reviews: 94 }
  ];

  // Busca horários disponíveis quando a data muda
  useEffect(() => {
    if (selectedDate && selectedService) {
      setIsLoadingSlots(true);
      getAvailableTimeSlots(selectedDate).then(slots => {
        setTimeSlots(slots);
        setIsLoadingSlots(false);
      });
    }
  }, [selectedDate, selectedService, getAvailableTimeSlots]);

  // Função de validação (pode ser movida para utils)
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const service = services.find(s => s.id === selectedService);
    if (!service) newErrors.service = 'Selecione um serviço';
    if (!selectedDate) newErrors.date = 'Selecione uma data';
    if (!selectedTime) newErrors.time = 'Selecione um horário';
    if (!formData.clientName.trim()) newErrors.clientName = 'Nome é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) newErrors.clientEmail = 'E-mail inválido';
    if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.clientPhone)) newErrors.clientPhone = 'Telefone inválido (ex: (11) 99999-9999)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const service = services.find(s => s.id === selectedService);
    if (!service || !selectedDate) return;

    const appointmentData = {
      serviceId: service.id,
      serviceName: service.name,
      partnerId: 'partner-id-placeholder', // Em um sistema real, isso viria do serviço
      duration: service.duration,
      price: service.price,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      ...formData,
    };

    try {
        await createAppointment(appointmentData as any);
        setShowConfirmation(true);
    } catch(err) {
        setErrors({ submit: 'Erro ao criar agendamento. Tente novamente.' });
    }
  };
  
  // As demais funções (resetForm, formatPhone, renderCalendar, etc.) permanecem as mesmas.
  // ...
  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setSelectedService('');
    setFormData({ clientName: '', clientEmail: '', clientPhone: '', notes: '' });
    setErrors({});
    setShowConfirmation(false);
    setStep(1);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (match, p1, p2, p3) => {
        let res = `(${p1})`;
        if (p2) res += ` ${p2}`;
        if (p3) res += `-${p3}`;
        return res;
      });
    }
    return value;
  };

  const isValidDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    if (date < today || date > maxDate || date.getDay() === 0) return false;
    return true;
  };
    
    // O restante do componente (renderização) permanece o mesmo
    // ...
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="h-12"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isValid = isValidDate(date);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => isValid && setSelectedDate(date)}
                    disabled={!isValid}
                    className={`h-12 w-full rounded-lg text-sm font-medium transition-all duration-200 ${
                        isSelected
                            ? 'bg-emerald-500 text-white shadow-md'
                            : isToday
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : isValid
                            ? 'hover:bg-emerald-50 text-gray-700'
                            : 'text-gray-300 cursor-not-allowed'
                    }`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    if (showConfirmation) {
        const service = services.find(s => s.id === selectedService);
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Agendamento Confirmado!</h2>
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Detalhes:</h3>
                    <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Serviço:</span> {service?.name}</p>
                        <p><span className="font-medium">Data:</span> {selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><span className="font-medium">Horário:</span> {selectedTime}</p>
                        <p><span className="font-medium">Cliente:</span> {formData.clientName}</p>
                    </div>
                </div>
                <button onClick={resetForm} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium">Novo Agendamento</button>
            </div>
        );
    }
  
    // O JSX principal permanece o mesmo
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Novo Agendamento</h1>
                <p className="text-emerald-100">Agende de forma rápida e segura</p>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><FileText className="w-5 h-5 mr-2 text-emerald-600" />1. Selecione o Serviço</h3>
                        <div className="space-y-3">
                            {services.map(service => (
                                <label key={service.id} className={`block p-4 border rounded-lg cursor-pointer ${selectedService === service.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}>
                                    <input type="radio" name="service" value={service.id} checked={selectedService === service.id} onChange={(e) => setSelectedService(e.target.value)} className="sr-only" />
                                    {/* ... conteúdo do card de serviço ... */}
                                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                                    <p className="text-sm text-gray-500">{service.provider}</p>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm">{service.duration} min</span>
                                        <span className="font-bold">R$ {service.price.toFixed(2)}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                    {selectedService && (
                         <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4"><CalendarDays className="w-5 h-5 mr-2 inline text-emerald-600" />2. Selecione a Data</h3>
                            <div className="flex items-center justify-between mb-4">
                                <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft /></button>
                                <h4 className="text-lg font-semibold">{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h4>
                                <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight /></button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-medium text-gray-600">
                                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d}>{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                         </div>
                    )}
                </div>
                <div className="space-y-6">
                    {selectedDate && selectedService && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                             <h3 className="text-lg font-semibold text-gray-900 mb-4"><Timer className="w-5 h-5 mr-2 inline text-emerald-600" />Horários Disponíveis</h3>
                             {isLoadingSlots ? <p>Carregando horários...</p> : 
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {timeSlots.map(slot => (
                                        <button key={slot.time} type="button" onClick={() => slot.available && setSelectedTime(slot.time)} disabled={!slot.available} className={`p-3 text-sm rounded-lg ${selectedTime === slot.time ? 'bg-emerald-500 text-white' : slot.available ? 'bg-gray-50 hover:bg-emerald-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                             }
                        </div>
                    )}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4"><User className="w-5 h-5 mr-2 inline text-emerald-600" />3. Dados do Cliente</h3>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                                <input type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className={`w-full p-2 border rounded ${errors.clientName ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                                <input type="email" value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} className={`w-full p-2 border rounded ${errors.clientEmail ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                                <input type="tel" value={formData.clientPhone} onChange={e => setFormData({...formData, clientPhone: formatPhone(e.target.value)})} maxLength={15} className={`w-full p-2 border rounded ${errors.clientPhone ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.clientPhone && <p className="text-red-500 text-xs mt-1">{errors.clientPhone}</p>}
                            </div>
                         </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium flex justify-center items-center disabled:bg-emerald-300">
                        {isSubmitting ? <RefreshCw className="animate-spin" /> : 'Confirmar Agendamento'}
                    </button>
                    {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
                </div>
            </form>
        </div>
    );
}