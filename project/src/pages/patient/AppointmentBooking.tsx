import React, { useState } from 'react';
import { Search, Calendar, Clock, MapPin, DollarSign, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

// Mock data
const specialties = [
  'Cardiologia', 'Dermatologia', 'Neurologia', 'Pediatria', 
  'Ortopedia', 'Ginecologia', 'Psiquiatria', 'Oftalmologia'
];

const mockDoctors = [
  {
    id: 'professional-1',
    name: 'Dra. Ana Oliveira',
    specialty: 'Cardiologia',
    rating: 4.9,
    reviewCount: 124,
    price: 250,
    nextAvailable: '2025-05-25T14:30:00',
    city: 'São Paulo',
    photoUrl: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'professional-2',
    name: 'Dr. Carlos Mendes',
    specialty: 'Dermatologia',
    rating: 4.8,
    reviewCount: 98,
    price: 200,
    nextAvailable: '2025-05-26T10:00:00',
    city: 'São Paulo',
    photoUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'professional-3',
    name: 'Dra. Mariana Santos',
    specialty: 'Cardiologia',
    rating: 4.7,
    reviewCount: 86,
    price: 230,
    nextAvailable: '2025-05-24T16:00:00',
    city: 'Rio de Janeiro',
    photoUrl: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
];

export const AppointmentBooking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty === selectedSpecialty ? null : specialty);
  };
  
  const handleProfessionalSelect = (professional: any) => {
    setSelectedProfessional(professional);
    setStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleConfirmAppointment = () => {
    // In a real app, this would make an API call to book the appointment
    alert('Consulta agendada com sucesso!');
    setStep(1);
    setSelectedProfessional(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };
  
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setSelectedDate(null);
        setSelectedTime(null);
      }
    }
  };
  
  // Filter doctors based on search query and specialty
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialty = selectedSpecialty === null || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });
  
  // Generate available times for the selected date
  const getAvailableTimes = () => {
    // In a real app, this would come from an API
    return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  };
  
  // Generate calendar days for the next 7 days
  const getCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };
  
  const calendarDays = getCalendarDays();
  const availableTimes = getAvailableTimes();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        {step > 1 && (
          <button 
            onClick={goBack}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {step === 1 && 'Serviços Médicos'}
          {step === 2 && 'Selecionar horário'}
        </h1>
      </div>
      
      {step === 1 && (
        <>
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              <Input
                placeholder="Buscar por especialidade, nome do médico ou localização"
                value={searchQuery}
                onChange={handleSearchChange}
                leftIcon={<Search size={18} />}
                fullWidth
              />
            </div>
            <div>
              <Button variant="outline" leftIcon={<Filter size={18} />}>
                Filtros avançados
              </Button>
            </div>
          </div>
          
          {/* Specialty chips */}
          <div className="flex flex-wrap gap-2">
            {specialties.map(specialty => (
              <button
                key={specialty}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedSpecialty === specialty
                    ? 'bg-cyan-100 text-cyan-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleSpecialtySelect(specialty)}
              >
                {specialty}
              </button>
            ))}
          </div>
          
          {/* Doctor listing */}
          <div className="space-y-4">
            {filteredDoctors.map(doctor => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 lg:w-1/5">
                    <img 
                      src={doctor.photoUrl} 
                      alt={doctor.name}
                      className="w-full h-48 md:h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                        <div className="flex items-center mb-4">
                          <div className="flex items-center mr-4">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="font-medium">{doctor.rating}</span>
                            <span className="text-gray-500 text-sm ml-1">({doctor.reviewCount} avaliações)</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={16} className="text-gray-500 mr-1" />
                            <span className="text-gray-600">{doctor.city}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="flex items-center text-sm">
                            <Calendar size={16} className="text-gray-500 mr-1" />
                            <span className="text-gray-600">Próxima disponível: {new Date(doctor.nextAvailable).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign size={16} className="text-gray-500 mr-1" />
                            <span className="text-gray-600">R$ {doctor.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button onClick={() => handleProfessionalSelect(doctor)}>
                          Agendar Serviços Médicos
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-600 mb-4">Tente ajustar sua busca ou filtros</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty(null);
                }}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      
      {step === 2 && selectedProfessional && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Selecionar data e horário">
              {/* Calendar days */}
              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-3">Selecione a data</h3>
                <div className="flex overflow-x-auto space-x-2 pb-2">
                  {calendarDays.map((day) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                    const dayOfWeek = day.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 3);
                    const dayOfMonth = day.getDate();
                    
                    return (
                      <button
                        key={day.toISOString()}
                        className={`flex flex-col items-center p-3 rounded-lg min-w-[80px] border ${
                          isSelected
                            ? 'bg-cyan-50 border-cyan-500'
                            : isToday
                              ? 'bg-blue-50 border-blue-100'
                              : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50'
                        }`}
                        onClick={() => handleDateSelect(day)}
                      >
                        <span className={`text-sm ${isSelected ? 'text-cyan-700' : 'text-gray-500'}`}>
                          {dayOfWeek}
                        </span>
                        <span className={`text-lg font-medium ${isSelected ? 'text-cyan-700' : 'text-gray-900'}`}>
                          {dayOfMonth}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Available times */}
              {selectedDate && (
                <div>
                  <h3 className="text-gray-700 font-medium mb-3">Selecione o horário</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {availableTimes.map((time) => {
                      const isSelected = time === selectedTime;
                      
                      return (
                        <button
                          key={time}
                          className={`py-2 px-3 rounded-lg text-center border ${
                            isSelected
                              ? 'bg-cyan-50 border-cyan-500 text-cyan-700'
                              : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50 text-gray-700'
                          }`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedTime && (
                    <div className="mt-6">
                      <Button fullWidth onClick={handleConfirmAppointment}>
                        Confirmar agendamento
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
          
          <div>
            <Card title="Detalhes da consulta">
              <div className="flex items-center mb-4">
                <Avatar 
                  src={selectedProfessional.photoUrl} 
                  name={selectedProfessional.name} 
                  size="lg" 
                  className="mr-3"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedProfessional.name}</h3>
                  <p className="text-gray-600">{selectedProfessional.specialty}</p>
                </div>
              </div>
              
              {selectedDate && selectedTime && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <Calendar size={18} className="text-gray-500 mr-2" />
                    <span className="text-gray-800">
                      {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="text-gray-500 mr-2" />
                    <span className="text-gray-800">{selectedTime}</span>
                  </div>
                </div>
              )}
              
              <div className="border-t border-b border-gray-100 py-4 my-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Valor da consulta</span>
                  <span className="font-medium">R$ {selectedProfessional.price.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  * O pagamento será realizado após a confirmação da consulta
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Política de cancelamento:</strong> Cancele com até 24 horas de antecedência sem custos.
                </p>
                <p>
                  <strong>Consulta online:</strong> O link para a videochamada será enviado por e-mail e WhatsApp.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};