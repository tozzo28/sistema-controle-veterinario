import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ChartsProps {
  leishmaniasisCases: any[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const Charts: React.FC<ChartsProps> = ({ leishmaniasisCases }) => {
  console.log('Charts component - leishmaniasisCases:', leishmaniasisCases);
  
  // Processar dados para gráficos
  const processData = () => {
    // Distribuição por raça
    const racaData = leishmaniasisCases.reduce((acc: any, case_) => {
      const raca = case_.raca || 'Não informado';
      acc[raca] = (acc[raca] || 0) + 1;
      return acc;
    }, {});

    const racaChartData = Object.entries(racaData).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

    // Distribuição por sexo
    const sexoData = leishmaniasisCases.reduce((acc: any, case_) => {
      const sexo = case_.sexo || 'Não informado';
      acc[sexo] = (acc[sexo] || 0) + 1;
      return acc;
    }, {});

    const sexoChartData = Object.entries(sexoData).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

    // Distribuição por idade (agrupar em faixas)
    const idadeData = leishmaniasisCases.reduce((acc: any, case_) => {
      const idade = case_.idade || 'Não informado';
      let faixa = 'Não informado';
      
      if (idade !== 'Não informado') {
        const idadeNum = parseInt(idade.replace(/\D/g, ''));
        if (idadeNum <= 1) faixa = '0-1 ano';
        else if (idadeNum <= 3) faixa = '1-3 anos';
        else if (idadeNum <= 5) faixa = '3-5 anos';
        else if (idadeNum <= 10) faixa = '5-10 anos';
        else faixa = '10+ anos';
      }
      
      acc[faixa] = (acc[faixa] || 0) + 1;
      return acc;
    }, {});

    const idadeChartData = Object.entries(idadeData).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

    return { racaChartData, sexoChartData, idadeChartData };
  };

  const { racaChartData, sexoChartData, idadeChartData } = processData();

  console.log('Processed data:', { racaChartData, sexoChartData, idadeChartData });

  // Se não há dados, mostrar mensagem
  if (leishmaniasisCases.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Análise de Distribuição
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhum dado disponível para análise. Adicione alguns casos de leishmaniose para ver os gráficos.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Debug Info */}
      <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Debug Info:</h4>
        <p className="text-yellow-700 dark:text-yellow-300">
          Total de casos: {leishmaniasisCases.length}
        </p>
        <p className="text-yellow-700 dark:text-yellow-300">
          Dados de raça: {JSON.stringify(racaChartData.slice(0, 3))}
        </p>
      </div>

      {/* Gráfico de Distribuição por Raça */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribuição por Raça
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={racaChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {racaChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Distribuição por Sexo */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribuição por Sexo
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sexoChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Distribuição por Idade */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribuição por Faixa Etária
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={idadeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
