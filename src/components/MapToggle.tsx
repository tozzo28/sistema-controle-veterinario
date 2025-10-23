import React, { useState } from 'react';
import { MapPin, Layers, Settings } from 'lucide-react';
import MapView from './MapView';
import GoogleMyMapsView from './GoogleMyMapsView';

interface MapToggleProps {
  leishmaniasisCases: any[];
}

type MapType = 'leaflet' | 'google';

const MapToggle: React.FC<MapToggleProps> = ({ leishmaniasisCases }) => {
  const [mapType, setMapType] = useState<MapType>('leaflet');

  return (
    <div className="space-y-4">
      {/* Seletor de Mapa */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Visualização do Mapa
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha o tipo de mapa para visualizar os casos
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Seleção */}
        <div className="flex space-x-2">
          <button
            onClick={() => setMapType('leaflet')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              mapType === 'leaflet'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Mapa Interativo</span>
          </button>
          
          <button
            onClick={() => setMapType('google')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              mapType === 'google'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Google My Maps</span>
          </button>
        </div>

        {/* Informações sobre cada tipo */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🗺️ Mapa Interativo (Leaflet)
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Geocodificação automática</li>
              <li>• Marcadores coloridos por status</li>
              <li>• Funciona offline</li>
              <li>• Sem necessidade de configuração</li>
            </ul>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              📍 Google My Maps
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Interface familiar do Google</li>
              <li>• Fácil de editar e compartilhar</li>
              <li>• Integração com Google Drive</li>
              <li>• Requer configuração inicial</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Renderizar o mapa selecionado */}
      {mapType === 'leaflet' ? (
        <MapView leishmaniasisCases={leishmaniasisCases} />
      ) : (
        <GoogleMyMapsView leishmaniasisCases={leishmaniasisCases} />
      )}
    </div>
  );
};

export default MapToggle;
