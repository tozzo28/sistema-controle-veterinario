import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import RabiesVaccineForm from './RabiesVaccineForm';
import RabiesVaccineList from './RabiesVaccineList';
import VaccinationMapView from './VaccinationMapView';
import VaccinationDetailsModal from './VaccinationDetailsModal';
import { RabiesVaccineRecord, createRabies, updateRabies } from '../api';

const RabiesVaccineControl: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RabiesVaccineRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<RabiesVaccineRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [onlyLost, setOnlyLost] = useState(false);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);

  const [stats, setStats] = useState({ total: 0, caes: 0, gatos: 0, dosesPerdidas: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  // Função para recarregar dados sem recarregar a página
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    fetch('/.netlify/functions/api-rabies-stats-simple').then(r => r.json()).then(setStats).catch(() => setStats({ total: 0, caes: 0, gatos: 0, dosesPerdidas: 0 }));
  }, [refreshKey]);

  useEffect(() => {
    // Carregar registros de vacinação para o mapa
    console.log('🔄 Carregando registros de vacinação...');
    fetch('/.netlify/functions/api-rabies-simple')
      .then(r => {
        console.log('📡 Status da resposta:', r.status);
        return r.json();
      })
      .then(data => {
        console.log('📊 Dados recebidos:', data);
        setVaccinationRecords(data);
      })
      .catch(error => {
        console.error('❌ Erro ao carregar vacinações:', error);
        setVaccinationRecords([]);
      });
  }, [refreshKey]);

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

      {(showForm || editingRecord) && (
        <RabiesVaccineForm 
          onClose={() => {
            setShowForm(false);
            setEditingRecord(null);
          }} 
          onSubmit={async (formData) => {
            try {
              if (editingRecord?.id) {
                // Editar registro existente
                console.log('🔄 [CONTROL] Iniciando atualização de vacinação');
                console.log('🔄 [CONTROL] ID do registro:', editingRecord.id);
                console.log('🔄 [CONTROL] Dados do formulário:', formData);
                
                const updated = await updateRabies(editingRecord.id, formData);
                console.log('✅ [CONTROL] Vacinação atualizada com sucesso no backend');
                console.log('✅ [CONTROL] Dados retornados:', updated);
                
                // Aguardar um pouco para garantir que o backend processou completamente
                await new Promise(resolve => setTimeout(resolve, 300));
              } else {
                // Criar novo registro
                console.log('➕ [CONTROL] Criando nova vacinação:', formData);
                await createRabies(formData);
                console.log('✅ [CONTROL] Vacinação criada com sucesso');
                
                // Aguardar um pouco para garantir que o backend processou completamente
                await new Promise(resolve => setTimeout(resolve, 300));
              }
              
              // Fechar o modal primeiro
              setShowForm(false);
              setEditingRecord(null);
              
              // Atualizar lista e estatísticas sem recarregar a página
              console.log('🔄 [CONTROL] Atualizando lista e estatísticas...');
              refreshData();
              console.log('✅ [CONTROL] Dados atualizados na interface');
            } catch (error: any) {
              console.error('❌ [CONTROL] Erro completo ao salvar vacinação:', error);
              console.error('❌ [CONTROL] Mensagem de erro:', error?.message);
              console.error('❌ [CONTROL] Stack:', error?.stack);
              alert(`Erro ao salvar vacinação:\n${error?.message || error}\n\nVerifique o console para mais detalhes.`);
            }
          }}
          initialData={editingRecord}
        />
      )}


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

        <RabiesVaccineList 
          searchTerm={searchTerm} 
          filterType={filterType} 
          onlyLost={onlyLost}
          onEdit={(record) => setEditingRecord(record)}
          onView={(record) => setViewingRecord(record)}
          refreshKey={refreshKey}
        />
      </div>

      {/* Modal de Visualização */}
      {viewingRecord && (
        <VaccinationDetailsModal 
          record={viewingRecord} 
          onClose={() => setViewingRecord(null)} 
        />
      )}

      {/* Mapa de Vacinações */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <VaccinationMapView vaccinationRecords={vaccinationRecords} />
      </div>
    </div>
  );
};

export default RabiesVaccineControl;