import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

interface ChartsProps {
  leishmaniasisCases: LeishmaniasisCase[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const Charts: React.FC<ChartsProps> = ({ leishmaniasisCases }) => {
  // Processar dados para os gráficos
  const processData = () => {
    // Distribuição por tipo de animal
    const tipoData = leishmaniasisCases.reduce((acc: any, case_) => {
      const tipo = case_.tipoAnimal || 'Não informado';
      const tipoFormatado = tipo === 'cao' ? 'Cão' : tipo === 'gato' ? 'Gato' : 'Outro';
      acc[tipoFormatado] = (acc[tipoFormatado] || 0) + 1;
      return acc;
    }, {});

    const tipoChartData = Object.entries(tipoData).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

    // Distribuição por raça
    const racaData = leishmaniasisCases.reduce((acc: any, case_) => {
      const raca = case_.raca || 'Não informado';
      acc[raca] = (acc[raca] || 0) + 1;
      return acc;
    }, {});

    const racaChartData = Object.entries(racaData)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 6) // Top 6 raças
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));

    // Distribuição por sexo
    const sexoData = leishmaniasisCases.reduce((acc: any, case_) => {
      const sexo = case_.sexo || 'Não informado';
      const sexoNormalizado = sexo.toLowerCase() === 'macho' ? 'Macho' : 
                             sexo.toLowerCase() === 'fêmea' ? 'Fêmea' : 
                             sexo.toLowerCase() === 'femea' ? 'Fêmea' : sexo;
      acc[sexoNormalizado] = (acc[sexoNormalizado] || 0) + 1;
      return acc;
    }, {});

    const sexoChartData = Object.entries(sexoData)
      .filter(([name, value]) => value > 0)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));

    // Distribuição por idade
    const idadeData = leishmaniasisCases.reduce((acc: any, case_) => {
      const idade = case_.idade || 'Não informado';
      acc[idade] = (acc[idade] || 0) + 1;
      return acc;
    }, {});

    const idadeChartData = Object.entries(idadeData)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 8) // Top 8 faixas etárias
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));

    return { tipoChartData, racaChartData, sexoChartData, idadeChartData };
  };

  const { tipoChartData, racaChartData, sexoChartData, idadeChartData } = processData();

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
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg text-sm">
          <p className="text-gray-900 dark:text-white font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Gráfico de Distribuição por Tipo de Animal */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribuição por Tipo de Animal
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tipoChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tipoChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Distribuição por Raça */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribuição por Raça
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={racaChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Bar 
                dataKey="value" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
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
            <PieChart>
              <Pie
                data={sexoChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sexoChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
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
            <BarChart data={idadeChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Bar 
                dataKey="value" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
