import React from 'react';
import { Users, Heart, MapPin, Calendar } from 'lucide-react';

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
  // Processar dados para as estatísticas
  const processData = () => {
    // Distribuição por tipo de animal
    const tipoData = leishmaniasisCases.reduce((acc: any, case_) => {
      const tipo = case_.tipoAnimal || 'Não informado';
      const tipoFormatado = tipo === 'cao' ? 'Cão' : tipo === 'gato' ? 'Gato' : 'Outro';
      acc[tipoFormatado] = (acc[tipoFormatado] || 0) + 1;
      return acc;
    }, {});

    // Distribuição por raça
    const racaData = leishmaniasisCases.reduce((acc: any, case_) => {
      const raca = case_.raca || 'Não informado';
      acc[raca] = (acc[raca] || 0) + 1;
      return acc;
    }, {});

    const topRacas = Object.entries(racaData)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);

    // Distribuição por sexo
    const sexoData = leishmaniasisCases.reduce((acc: any, case_) => {
      const sexo = case_.sexo || 'Não informado';
      const sexoNormalizado = sexo.toLowerCase() === 'macho' ? 'Macho' : 
                             sexo.toLowerCase() === 'fêmea' ? 'Fêmea' : 
                             sexo.toLowerCase() === 'femea' ? 'Fêmea' : sexo;
      acc[sexoNormalizado] = (acc[sexoNormalizado] || 0) + 1;
      return acc;
    }, {});

    // Distribuição por área
    const areaData = leishmaniasisCases.reduce((acc: any, case_) => {
      const area = case_.area || 'Não informado';
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});

    const topAreas = Object.entries(areaData)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);

    return { tipoData, topRacas, sexoData, topAreas };
  };

  const { tipoData, topRacas, sexoData, topAreas } = processData();

  if (leishmaniasisCases.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Análise de Distribuição
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhum dado disponível para análise. Adicione alguns casos de leishmaniose para ver as estatísticas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card de Distribuição por Tipo de Animal */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Por Tipo de Animal
          </h3>
        </div>
        <div className="space-y-3">
          {Object.entries(tipoData).map(([tipo, count], index) => (
            <div key={tipo} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tipo}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {count as number}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card de Top Raças */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Heart className="h-6 w-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Raças
          </h3>
        </div>
        <div className="space-y-3">
          {topRacas.map(([raca, count], index) => (
            <div key={raca} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {raca}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {count as number}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card de Distribuição por Sexo */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Por Sexo
          </h3>
        </div>
        <div className="space-y-3">
          {Object.entries(sexoData).map(([sexo, count], index) => (
            <div key={sexo} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{sexo}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {count as number}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card de Top Áreas */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <MapPin className="h-6 w-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Áreas
          </h3>
        </div>
        <div className="space-y-3">
          {topAreas.map(([area, count], index) => (
            <div key={area} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {area === 'Não informado' ? 'Não informado' : `Área ${area}`}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {count as number}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;
