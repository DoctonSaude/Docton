import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { User, Edit, Trash2, Plus, FileText, Activity, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

interface PatientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  healthConditions: string[];
  lastAppointment: Date | null;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const mockPatients: PatientData[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    healthConditions: ['Hipertensão', 'Diabetes'],
    lastAppointment: new Date('2025-03-15'),
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '(11) 98765-4322',
    cpf: '987.654.321-00',
    healthConditions: ['Asma'],
    lastAppointment: new Date('2025-03-10'),
    status: 'active',
    createdAt: new Date('2024-02-01'),
  },
];

const columnHelper = createColumnHelper<PatientData>();

export const PatientsPage = () => {
  const [data] = useState(() => [...mockPatients]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);

  const columns = [
    columnHelper.accessor('name', {
      header: 'Paciente',
      cell: info => (
        <div className="flex items-center">
          <Avatar 
            name={info.getValue()} 
            size="md" 
            className="mr-3"
          />
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Telefone',
      cell: info => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor('healthConditions', {
      header: 'Condições de Saúde',
      cell: info => (
        <div className="flex flex-wrap gap-1">
          {info.getValue().map((condition, index) => (
            <Badge key={index} variant="secondary" size="sm">
              {condition}
            </Badge>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor('lastAppointment', {
      header: 'Última Consulta',
      cell: info => {
        const date = info.getValue();
        return date ? (
          <span className="text-gray-600">
            {date.toLocaleDateString('pt-BR')}
          </span>
        ) : (
          <span className="text-gray-400">Nunca consultou</span>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <Badge
          variant={info.getValue() === 'active' ? 'success' : 'danger'}
          size="sm"
          rounded
        >
          {info.getValue() === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: info => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="p-1"
            onClick={() => handleViewPatient(info.row.original.id)}
          >
            <FileText size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="p-1"
            onClick={() => handleEditPatient(info.row.original.id)}
          >
            <Edit size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="p-1 text-red-600 hover:text-red-700"
            onClick={() => handleDeletePatient(info.row.original.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleViewPatient = (id: string) => {
    // Implement view patient details
    console.log('View patient:', id);
  };

  const handleEditPatient = (id: string) => {
    // Implement edit patient
    console.log('Edit patient:', id);
  };

  const handleDeletePatient = (id: string) => {
    // Implement delete patient
    console.log('Delete patient:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie todos os pacientes cadastrados no sistema
          </p>
        </div>
        <Button
          onClick={() => setShowAddPatient(true)}
          leftIcon={<Plus size={16} />}
        >
          Novo Paciente
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="w-full md:w-96">
            <Input
              placeholder="Buscar pacientes..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              fullWidth
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Calendar size={16} />}>
              Agendamentos
            </Button>
            <Button variant="outline" leftIcon={<Activity size={16} />}>
              Relatórios
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
            >
              Anterior
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline"
            >
              Próxima
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{' '}
                <span className="font-medium">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                até{' '}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getPrePaginationRowModel().rows.length
                  )}
                </span>{' '}
                de{' '}
                <span className="font-medium">{table.getPrePaginationRowModel().rows.length}</span>{' '}
                resultados
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  variant="outline"
                  className="rounded-l-md"
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  variant="outline"
                  className="rounded-r-md"
                >
                  Próxima
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};