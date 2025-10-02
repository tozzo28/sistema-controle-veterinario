import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MapPin, Building } from 'lucide-react';
import RabiesVaccineForm from './RabiesVaccineForm';
import RabiesVaccineList from './RabiesVaccineList';
import { fetchRabies } from '../api';

const RabiesVaccineControl: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [onlyLost, setOnlyLost] = useState(false);

  const [stats, setStats] = useState({ total: 0, caes: 0, gatos: 0, dosesPerdidas: 0, locais: { centro: 0, clinica: 0, hospital: 0 } });

  useEffect(() => {
    fetch('/api/rabies/stats').then(r => r.json()).then(setStats).catch(() => setStats({ total: 0, caes: 0, gatos: 0, dosesPerdidas: 0, locais: { centro: 0, clinica: 0, hospital: 0 } }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Controle de Vacina Antirrábica</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Vacinação</span>
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ title: 'Total Vacinados', value: stats.total, color: 'text-green-600' }, { title: 'Cães', value: stats.caes, color: 'text-blue-600' }, { title: 'Gatos', value: stats.gatos, color: 'text-purple-600' }, { title: 'Doses Perdidas', value: stats.dosesPerdidas, color: 'text-red-600' }].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{stat.title}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <RabiesVaccineForm onClose={() => setShowForm(false)} />
      )}

      {/* Locais de Vacinação */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Locais de Vacinação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Building className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">Centro Veterinário Municipal</span>
            </div>
            <p className="text-sm text-gray-600">Vacinas aplicadas: {stats.locais.centro}</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Building className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">Clínica Pet Care</span>
            </div>
            <p className="text-sm text-gray-600">Vacinas aplicadas: {stats.locais.clinica}</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Building className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">Hospital Veterinário São Francisco</span>
            </div>
            <p className="text-sm text-gray-600">Vacinas aplicadas: {stats.locais.hospital}</p>
          </div>
        </div>
      </div>

      {/* Lista de Vacinações */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registro de Vacinações</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome do animal ou tutor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Todos os Animais</option>
              <option value="cao">Cães</option>
              <option value="gato">Gatos</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={onlyLost}
              onChange={(e) => setOnlyLost(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            Apenas doses perdidas
          </label>
        </div>

        <RabiesVaccineList searchTerm={searchTerm} filterType={filterType} onlyLost={onlyLost} />
      </div>
    </div>
  );
};

export default RabiesVaccineControl;