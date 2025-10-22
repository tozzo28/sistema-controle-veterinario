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
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Por Raça</h4>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {(() => {
                    const racas = leishmaniasisCases.reduce((acc: any, case_) => {
                      const raca = case_.raca || 'Não informado';
                      acc[raca] = (acc[raca] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.keys(racas).length;
                  })()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">raças diferentes</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const racas = leishmaniasisCases.reduce((acc: any, case_) => {
                  const raca = case_.raca || 'Não informado';
                  acc[raca] = (acc[raca] || 0) + 1;
                  return acc;
                }, {});

                const racasArray = Object.entries(racas)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5);

                const total = leishmaniasisCases.length;

                if (racasArray.length === 0) {
                  return (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma raça registrada</p>
                    </div>
                  );
                }

                return racasArray.map(([raca, count], index) => {
                  const percentage = total > 0 ? ((count as number) / total * 100).toFixed(1) : '0';
                  const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500'];
                  
                  return (
                    <div key={raca} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate flex-1">
                          {raca}
                        </span>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {percentage}%
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {count} casos
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Distribuição por Sexo */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl shadow-lg border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Por Sexo</h4>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {(() => {
                    const sexos = leishmaniasisCases.reduce((acc: any, case_) => {
                      const sexo = case_.sexo || 'Não informado';
                      acc[sexo] = (acc[sexo] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.keys(sexos).length;
                  })()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">categorias</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const sexos = leishmaniasisCases.reduce((acc: any, case_) => {
                  const sexo = case_.sexo || 'Não informado';
                  acc[sexo] = (acc[sexo] || 0) + 1;
                  return acc;
                }, {});

                const sexosArray = Object.entries(sexos)
                  .sort(([,a], [,b]) => (b as number) - (a as number));

                const total = leishmaniasisCases.length;

                if (sexosArray.length === 0) {
                  return (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum sexo registrado</p>
                    </div>
                  );
                }

                return sexosArray.map(([sexo, count], index) => {
                  const percentage = total > 0 ? ((count as number) / total * 100).toFixed(1) : '0';
                  const colors = ['bg-green-500', 'bg-emerald-500', 'bg-teal-500'];
                  
                  const getSexIcon = (sexo: string) => {
                    if (sexo === 'macho') {
                      return (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm" style={{fontSize: '14px'}}>M</span>
                        </div>
                      );
                    } else if (sexo === 'femea') {
                      return (
                        <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm" style={{fontSize: '14px'}}>F</span>
                        </div>
                      );
                    } else {
                      return (
                        <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm" style={{fontSize: '14px'}}>?</span>
                        </div>
                      );
                    }
                  };
                  
                  return (
                    <div key={sexo} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-3">
                          {getSexIcon(sexo)}
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {sexo === 'macho' ? 'Macho' : sexo === 'femea' ? 'Fêmea' : sexo}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            {percentage}%
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {count} casos
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Distribuição por Idade */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Por Idade</h4>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {(() => {
                    const idades = leishmaniasisCases.reduce((acc: any, case_) => {
                      const idade = case_.idade || 'Não informado';
                      acc[idade] = (acc[idade] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.keys(idades).length;
                  })()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">faixas etárias</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const idades = leishmaniasisCases.reduce((acc: any, case_) => {
                  const idade = case_.idade || 'Não informado';
                  acc[idade] = (acc[idade] || 0) + 1;
                  return acc;
                }, {});

                const idadesArray = Object.entries(idades)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5);

                const total = leishmaniasisCases.length;

                if (idadesArray.length === 0) {
                  return (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma idade registrada</p>
                    </div>
                  );
                }

                return idadesArray.map(([idade, count], index) => {
                  const percentage = total > 0 ? ((count as number) / total * 100).toFixed(1) : '0';
                  const colors = ['bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500', 'bg-amber-500'];
                  
                  return (
                    <div key={idade} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate flex-1">
                          {idade}
                        </span>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            {percentage}%
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {count} casos
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                });
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