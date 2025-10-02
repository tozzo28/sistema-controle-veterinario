import React, { useEffect, useState } from 'react';
import { AlertTriangle, Syringe, Activity, Shield } from 'lucide-react';
import StatCard from './StatCard';

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
    fetch('/.netlify/functions/api-rabies-stats')
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Último update: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Controle de Leishmaniose</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leishmaniasisStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Vacina Antirrábica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rabiesCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumo das Atividades</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Casos Recentes de Leishmaniose</h4>
              {leishmaniasisCases.length > 0 ? (
                <div className="space-y-3">
                  {leishmaniasisCases.slice(0, 5).map((case_) => (
                    <div key={case_.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium text-gray-900">{case_.nomeAnimal}</p>
                        <p className="text-sm text-gray-500">{case_.nomeTutor}</p>
                        <p className="text-xs text-gray-400 capitalize">
                          {case_.tipoAnimal === 'cao' ? 'Cão' : case_.tipoAnimal === 'gato' ? 'Gato' : 'Outro'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        case_.status === 'positivo' ? 'bg-red-100 text-red-800' :
                        case_.status === 'negativo' ? 'bg-green-100 text-green-800' :
                        case_.status === 'tratamento' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
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
                <p className="text-gray-500">Nenhum caso registrado ainda.</p>
              )}
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Tipo de Animal</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="font-medium text-gray-900">Cães</span>
                  <span className="text-sm text-gray-500">
                    {leishmaniasisCases.filter(case_ => case_.tipoAnimal === 'cao').length} casos
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="font-medium text-gray-900">Gatos</span>
                  <span className="text-sm text-gray-500">
                    {leishmaniasisCases.filter(case_ => case_.tipoAnimal === 'gato').length} casos
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="font-medium text-gray-900">Outros</span>
                  <span className="text-sm text-gray-500">
                    {leishmaniasisCases.filter(case_ => case_.tipoAnimal === 'outro').length} casos
                  </span>
                </div>
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Áreas de Atuação</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="font-medium text-gray-900">Área 1</span>
                  <span className="text-sm text-gray-500">
                    {leishmaniasisCases.filter(case_ => case_.area === '1').length} casos
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="font-medium text-gray-900">Área 2</span>
                  <span className="text-sm text-gray-500">
                    {leishmaniasisCases.filter(case_ => case_.area === '2').length} casos
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="font-medium text-gray-900">Outras Áreas</span>
                  <span className="text-sm text-gray-500">
                    {leishmaniasisCases.filter(case_ => !['1', '2'].includes(case_.area)).length} casos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;