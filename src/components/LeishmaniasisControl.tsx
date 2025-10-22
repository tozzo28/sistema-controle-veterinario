import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import LeishmaniasisForm from './LeishmaniasisForm';
import LeishmaniasisList from './LeishmaniasisList';

// Interface para os casos de leishmaniose
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

interface LeishmaniasisControlProps {
  cases: LeishmaniasisCase[];
  onAddCase: (newCase: Omit<LeishmaniasisCase, 'id'>) => void;
  onDeleteCase: (id: number) => void;
}

const LeishmaniasisControl: React.FC<LeishmaniasisControlProps> = ({ 
  cases, 
  onAddCase, 
  onDeleteCase 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtrar casos baseado na busca e status
  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.nomeAnimal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.nomeTutor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (formData: any) => {
    onAddCase(formData);
    setShowForm(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Controle de Leishmaniose</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Novo Caso</span>
        </button>
      </div>

      {showForm && (
        <LeishmaniasisForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />
      )}

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="Buscar por nome do animal ou tutor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 pr-4 py-3 sm:py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base sm:text-sm"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 sm:pl-10 pr-8 py-3 sm:py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base sm:text-sm"
            >
              <option value="all">Todos os Status</option>
              <option value="notificado">Notificados</option>
              <option value="positivo">Positivos</option>
              <option value="negativo">Negativos</option>
              <option value="eutanasiado">Eutanasiados</option>
              <option value="tratamento">Em Tratamento</option>
              <option value="recusa_eutanasia">Recusa Eutanásia</option>
              <option value="recusa_tratamento">Recusa Tratamento</option>
            </select>
          </div>
        </div>

        <LeishmaniasisList 
          cases={filteredCases} 
          onDelete={onDeleteCase}
        />
      </div>
    </div>
  );
};

export default LeishmaniasisControl;