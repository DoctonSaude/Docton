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
import { User, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    role: 'Editor',
    status: 'active',
    createdAt: new Date('2024-02-01'),
  },
  // Add more mock users as needed
];

const columnHelper = createColumnHelper<UserData>();

export const UsersPage = () => {
  const [data] = useState(() => [...mockUsers]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = [
    columnHelper.accessor('name', {
      header: 'Nome',
      cell: info => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-gray-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Função',
      cell: info => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          info.getValue() === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {info.getValue() === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Data de cadastro',
      cell: info => info.getValue().toLocaleDateString('pt-BR'),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: info => (
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-gray-500">
            <Edit className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-red-500">
            <Trash2 className="h-5 w-5" />
          </button>
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os usuários do sistema, incluindo seus nomes, emails, funções e status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button leftIcon={<Plus className="h-5 w-5" />}>
            Adicionar usuário
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
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
                <tbody className="divide-y divide-gray-200 bg-white">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm"
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
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
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
      </div>
    </div>
  );
};