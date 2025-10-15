import React, { useEffect, useState } from 'react';
import { AlertTriangle, Syringe, Activity, Shield } from 'lucide-react';
import StatCard from './StatCard';
import Charts from './Charts';
import MapView from './MapView';

interface LeishmaniasisCase {
  id: number;
  nomeAnimal: string;
  tipoAnimal: string;
  idade?: string;
  raca?: string;
  sexo?: string;
  nomeTutor: string;
  status: string;
  area: string;
  quadra: string;
  dataNotificacao: string;
}

interface DashboardProps {
  leishmaniasisCases?: LeishmaniasisCase[];
}

const Dashboard: React.FC<DashboardProps> = ({ leishmaniasisCases = [] }) => {
  const [rabiesStats, setRabiesStats] = useState({ total: 0, caes: 0, gatos: 0, dosesPerdidas: 0 });

  useEffect(() => {
    fetch('/.netlify/functions/api-rabies-stats-simple')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data) => setRabiesStats({ total: data.total, caes: data.caes, gatos: data.gatos, dosesPerdidas: data.dosesPerdidas }))
      .catch(() => setRabiesStats({ total: 0, caes: 0, gatos: 0, dosesPerdidas: 0 }));
  }, []);
  // Calcular estatísticas dinâmicas baseadas nos casos reais
  const getLeishmaniasisStats = () => {
    if (leishmaniasisCases.length === 0) {
      return [
        { title: 'Notificados', value: '0', icon: AlertTriangle, color: 'yellow' },
        { title: 'Positivos', value: '0', icon: Activity, color: 'red' },
        { title: 'Em Tratamento', value: '0', icon: Activity, color: 'blue' },
        { title: 'Total de Casos', value: '0', icon: Activity, color: 'gray' },
      ];
    }

    const notificados = leishmaniasisCases.filter(case_ => case_.status === 'notificado').length;
    const positivos = leishmaniasisCases.filter(case_ => case_.status === 'positivo').length;
    const tratamento = leishmaniasisCases.filter(case_ => case_.status === 'tratamento').length;
    const total = leishmaniasisCases.length;

    return [
      { title: 'Notificados', value: notificados.toString(), icon: AlertTriangle, color: 'yellow' },
      { title: 'Positivos', value: positivos.toString(), icon: Activity, color: 'red' },
      { title: 'Em Tratamento', value: tratamento.toString(), icon: Activity, color: 'blue' },
      { title: 'Total de Casos', value: total.toString(), icon: Activity, color: 'gray' },
    ];
  };

  const leishmaniasisStats = getLeishmaniasisStats();
  
  const rabiesCards = [
    { title: 'Total Vacinados', value: rabiesStats.total.toString(), icon: Syringe, color: 'green' },
    { title: 'Cães', value: rabiesStats.caes.toString(), icon: Shield, color: 'blue' },
    { title: 'Gatos', value: rabiesStats.gatos.toString(), icon: Shield, color: 'purple' },
    { title: 'Doses Perdidas', value: rabiesStats.dosesPerdidas.toString(), icon: Syringe, color: 'red' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Último update: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      <section>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Controle de Leishmaniose</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {leishmaniasisStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Vacina Antirrábica</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {rabiesCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Mapa de Georreferenciamento */}
      <section>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Mapa de Casos</h3>
        <MapView leishmaniasisCases={leishmaniasisCases} />
      </section>

      {/* Análise de Distribuição */}
      <section>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Análise de Distribuição</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Distribuição por Raça */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Por Raça</h4>
            <div className="space-y-2 sm:space-y-3">
              {(() => {
                const racas = leishmaniasisCases.reduce((acc: any, case_) => {
                  const raca = case_.raca || 'Não informado';
                  acc[raca] = (acc[raca] || 0) + 1;
                  return acc;
                }, {});

                const racasArray = Object.entries(racas)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5);

                if (racasArray.length === 0) {
                  return <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma raça registrada.</p>;
                }

                return racasArray.map(([raca, count]) => (
                  <div key={raca} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {raca}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {count} casos
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Distribuição por Sexo */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Por Sexo</h4>
            <div className="space-y-2 sm:space-y-3">
              {(() => {
                const sexos = leishmaniasisCases.reduce((acc: any, case_) => {
                  const sexo = case_.sexo || 'Não informado';
                  acc[sexo] = (acc[sexo] || 0) + 1;
                  return acc;
                }, {});

                const sexosArray = Object.entries(sexos)
                  .sort(([,a], [,b]) => (b as number) - (a as number));

                if (sexosArray.length === 0) {
                  return <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum sexo registrado.</p>;
                }

                return sexosArray.map(([sexo, count]) => (
                  <div key={sexo} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {sexo === 'macho' ? 'Macho' : sexo === 'femea' ? 'Fêmea' : sexo}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {count} casos
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Distribuição por Idade */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Por Idade</h4>
            <div className="space-y-2 sm:space-y-3">
              {(() => {
                const idades = leishmaniasisCases.reduce((acc: any, case_) => {
                  const idade = case_.idade || 'Não informado';
                  acc[idade] = (acc[idade] || 0) + 1;
                  return acc;
                }, {});

                const idadesArray = Object.entries(idades)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5);

                if (idadesArray.length === 0) {
                  return <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma idade registrada.</p>;
                }

                return idadesArray.map(([idade, count]) => (
                  <div key={idade} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {idade}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {count} casos
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Resumo das Atividades</h3>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Casos Recentes de Leishmaniose</h4>
              {leishmaniasisCases.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {leishmaniasisCases.slice(0, 5).map((case_) => (
                    <div key={case_.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{case_.nomeAnimal}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{case_.nomeTutor}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                          {case_.tipoAnimal === 'cao' ? 'Cão' : case_.tipoAnimal === 'gato' ? 'Gato' : 'Outro'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        case_.status === 'positivo' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        case_.status === 'negativo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        case_.status === 'tratamento' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {case_.status === 'positivo' ? 'Positivo' :
                         case_.status === 'negativo' ? 'Negativo' :
                         case_.status === 'tratamento' ? 'Em Tratamento' :
                         'Notificado'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum caso registrado ainda.</p>
              )}
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Distribuição por Tipo de Animal</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Cães</span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {leishmaniasisCases.filter(case_ => case_.tipoAnimal === 'cao').length} casos
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Gatos</span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {leishmaniasisCases.filter(case_ => case_.tipoAnimal === 'gato').length} casos
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Outros</span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {leishmaniasisCases.filter(case_ => case_.tipoAnimal === 'outro').length} casos
                  </span>
                </div>
              </div>
              
              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 mt-4 sm:mt-6">Distribuição por Área</h4>
              <div className="space-y-2 sm:space-y-3">
                {(() => {
                  // Calcular áreas dinamicamente
                  const areas = leishmaniasisCases.reduce((acc: any, case_) => {
                    const area = case_.area || 'Não informado';
                    acc[area] = (acc[area] || 0) + 1;
                    return acc;
                  }, {});

                  const areasArray = Object.entries(areas)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 5); // Mostrar apenas as 5 áreas com mais casos

                  if (areasArray.length === 0) {
                    return (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                        Nenhuma área registrada ainda.
                      </p>
                    );
                  }

                  return areasArray.map(([area, count]) => (
                    <div key={area} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {area === 'Não informado' ? 'Não informado' : `Área ${area}`}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {count} casos
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;