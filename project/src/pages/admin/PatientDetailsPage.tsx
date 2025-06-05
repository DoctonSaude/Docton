import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Activity, 
  FileText, 
  AlertTriangle,
  Pills,
  Clock,
  Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

export const PatientDetailsPage = () => {
  const { id } = useParams();

  // Mock patient data - in a real app, this would come from an API
  const patient = {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    birthDate: new Date('1985-03-15'),
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    healthInfo: {
      conditions: ['Hipertensão', 'Diabetes Tipo 2'],
      allergies: ['Penicilina', 'Dipirona'],
      medications: [
        { name: 'Losartana', dosage: '50mg', frequency: '1x ao dia' },
        { name: 'Metformina', dosage: '850mg', frequency: '2x ao dia' }
      ]
    },
    appointments: [
      {
        id: 'apt-1',
        date: new Date('2025-03-15T10:00:00'),
        doctor: 'Dra. Ana Oliveira',
        specialty: 'Cardiologia',
        status: 'completed',
        notes: 'Paciente apresentou melhora significativa na pressão arterial.'
      },
      {
        id: 'apt-2',
        date: new Date('2025-03-25T14:30:00'),
        doctor: 'Dr. Carlos Santos',
        specialty: 'Endocrinologia',
        status: 'scheduled'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Exame de Sangue',
        date: new Date('2025-03-10'),
        type: 'exam',
        url: '#'
      },
      {
        id: 'doc-2',
        name: 'Receita Médica',
        date: new Date('2025-03-15'),
        type: 'prescription',
        url: '#'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Paciente</h1>
          <p className="mt-1 text-sm text-gray-500">
            Informações completas e histórico médico
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            Editar
          </Button>
          <Button>
            Agendar Consulta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center mb-6">
              <Avatar 
                name={patient.name} 
                size="xl" 
                className="mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                <p className="text-gray-500">{patient.cpf}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <Badge variant="primary" rounded>Plano Ativo</Badge>
                  <Badge variant="success" rounded>Dados Completos</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Informações Pessoais
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{patient.birthDate.toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Endereço
                </h3>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                  <div>
                    <p>{patient.address.street}, {patient.address.number}</p>
                    <p>{patient.address.neighborhood}</p>
                    <p>{patient.address.city} - {patient.address.state}</p>
                    <p>{patient.address.zipCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Histórico de Consultas
              </h3>
              <div className="space-y-4">
                {patient.appointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-lg mr-4">
                        <Calendar className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.date.toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge 
                        variant={appointment.status === 'completed' ? 'success' : 'primary'}
                        rounded
                      >
                        {appointment.status === 'completed' ? 'Realizada' : 'Agendada'}
                      </Badge>
                      {appointment.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-3"
                        >
                          Ver prontuário
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informações de Saúde
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Condições
                </h4>
                <div className="flex flex-wrap gap-2">
                  {patient.healthInfo.conditions.map((condition, index) => (
                    <Badge key={index} variant="warning" rounded>
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Alergias
                </h4>
                <div className="flex flex-wrap gap-2">
                  {patient.healthInfo.allergies.map((allergy, index) => (
                    <Badge key={index} variant="danger" rounded>
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Medicamentos
                </h4>
                <div className="space-y-2">
                  {patient.healthInfo.medications.map((medication, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <Pills className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-gray-500">
                          {medication.dosage} - {medication.frequency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Documentos
            </h3>
            <div className="space-y-3">
              {patient.documents.map(doc => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {doc.date.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};