import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Shield } from 'lucide-react';
import { fetchRabies, deleteRabies, RabiesVaccineRecord } from '../api';

interface RabiesVaccineListProps {
  searchTerm: string;
  filterType: string;
  onlyLost?: boolean;
}

const RabiesVaccineList: React.FC<RabiesVaccineListProps> = ({ searchTerm, filterType, onlyLost = false }) => {
  const [rows, setRows] = useState<RabiesVaccineRecord[]>([]);

  useEffect(() => {
    fetchRabies().then(setRows).catch(() => setRows([]));
  }, []);

  const getAnimalIcon = (tipo: string) => {
    return tipo === 'cao' ? '🐕' : '🐱';
  };

  const getAnimalType = (tipo: string) => {
    return tipo === 'cao' ? 'Cão' : 'Gato';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Animal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tutor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Vacinação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Local
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Localização
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lote
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows
            .filter(v => (filterType === 'all' || v.tipo === filterType))
            .filter(v => (!onlyLost || v.dosePerdida === true))
            .filter(v => v.nomeAnimal.toLowerCase().includes(searchTerm.toLowerCase()) || v.nomeTutor.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((vacinacao) => (
            <tr key={vacinacao.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-lg mr-2">{getAnimalIcon(vacinacao.tipo)}</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {vacinacao.nomeAnimal}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getAnimalType(vacinacao.tipo)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {vacinacao.nomeTutor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(vacinacao.dataVacinacao).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {vacinacao.localVacinacao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Área {vacinacao.area} - {vacinacao.quadra}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {vacinacao.loteVacina}
                  </span>
                  {vacinacao.dosePerdida === true && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Dose perdida
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-yellow-600 hover:text-yellow-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={async () => { await deleteRabies(vacinacao.id); setRows(prev => prev.filter(r => r.id !== vacinacao.id)); }} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RabiesVaccineList;