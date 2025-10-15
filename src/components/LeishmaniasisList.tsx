import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface LeishmaniasisCase {
  id: number;
  nomeAnimal: string;
  tipoAnimal: string;
  idade?: string;
  raca?: string;
  sexo?: string;
  pelagem?: string;
  corPelagem?: string;
  nomeTutor: string;
  status: string;
  area: string;
  quadra: string;
  dataNotificacao: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
}

interface LeishmaniasisListProps {
  cases: LeishmaniasisCase[];
  onDelete: (id: number) => void;
}

const LeishmaniasisList: React.FC<LeishmaniasisListProps> = ({ cases, onDelete }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      notificado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      positivo: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      negativo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      eutanasiado: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      tratamento: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      recusa_eutanasia: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      recusa_tratamento: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };

    const statusNames = {
      notificado: 'Notificado',
      positivo: 'Positivo',
      negativo: 'Negativo',
      eutanasiado: 'Eutanasiado',
      tratamento: 'Em Tratamento',
      recusa_eutanasia: 'Recusa Eutanásia',
      recusa_tratamento: 'Recusa Tratamento',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {statusNames[status as keyof typeof statusNames]}
      </span>
    );
  };

  const getTipoAnimalBadge = (tipo: string) => {
    const tipoConfig = {
      cao: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      gato: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      outro: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    const tipoNames = {
      cao: 'Cão',
      gato: 'Gato',
      outro: 'Outro',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoConfig[tipo as keyof typeof tipoConfig]}`}>
        {tipoNames[tipo as keyof typeof tipoNames]}
      </span>
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este caso?')) {
      onDelete(id);
    }
  };

  if (cases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">Nenhum caso encontrado.</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Clique em "Novo Caso" para adicionar o primeiro caso.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Animal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tutor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {cases.map((caso) => (
              <tr key={caso.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {caso.nomeAnimal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTipoAnimalBadge(caso.tipoAnimal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {caso.nomeTutor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(caso.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Área {caso.area} - {caso.quadra}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(caso.dataNotificacao).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(caso.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {cases.map((caso) => (
          <div key={caso.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {caso.nomeAnimal}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {caso.nomeTutor}
                </p>
              </div>
              <div className="flex space-x-1 ml-2">
                <button 
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-1"
                  title="Visualizar"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors p-1"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(caso.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {getTipoAnimalBadge(caso.tipoAnimal)}
              {getStatusBadge(caso.status)}
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p><span className="font-medium">Localização:</span> Área {caso.area} - {caso.quadra}</p>
              <p><span className="font-medium">Data:</span> {new Date(caso.dataNotificacao).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LeishmaniasisList;