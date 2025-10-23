import React, { useState } from 'react';
import { MapPin, ExternalLink, RefreshCw } from 'lucide-react';

interface GoogleMyMapsViewProps {
  leishmaniasisCases: any[];
}

const GoogleMyMapsView: React.FC<GoogleMyMapsViewProps> = ({ leishmaniasisCases }) => {
  const [isLoading, setIsLoading] = useState(false);

  // ID do Google My Maps (você precisará criar um mapa no Google My Maps e obter este ID)
  const GOOGLE_MY_MAPS_ID = "1ABC123DEF456GHI789"; // Substitua pelo ID real do seu mapa

  // URL do Google My Maps embed
  const googleMapsUrl = `https://www.google.com/maps/d/embed?mid=${GOOGLE_MY_MAPS_ID}`;

  // Função para abrir o Google My Maps em nova aba
  const openGoogleMyMaps = () => {
    window.open(`https://www.google.com/maps/d/viewer?mid=${GOOGLE_MY_MAPS_ID}`, '_blank');
  };

  // Função para atualizar o mapa
  const handleRefresh = () => {
    setIsLoading(true);
    // Força o reload do iframe
    const iframe = document.getElementById('google-my-maps-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Estatísticas dos casos
  const stats = {
    total: leishmaniasisCases.length,
    positivos: leishmaniasisCases.filter(c => c.status === 'positivo').length,
    notificados: leishmaniasisCases.filter(c => c.status === 'notificado').length,
    tratamento: leishmaniasisCases.filter(c => c.status === 'tratamento').length,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <div className="p-2 bg-red-500 rounded-lg">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Mapa Interativo - Paraguaçu/SP
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visualização via Google My Maps
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={openGoogleMyMaps}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Abrir no Google</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">Positivos</p>
              <p className="text-lg font-bold text-red-700 dark:text-red-300">{stats.positivos}</p>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Notificados</p>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{stats.notificados}</p>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Tratamento</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{stats.tratamento}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total</p>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{stats.total}</p>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">#</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa do Google My Maps */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-blue-500 font-medium">Atualizando mapa...</span>
            </div>
          </div>
        )}
        
        <iframe
          id="google-my-maps-iframe"
          src={googleMapsUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Instruções */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          📍 Como usar este mapa:
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Clique em "Abrir no Google" para editar o mapa</li>
          <li>• Adicione marcadores para cada caso de leishmaniose</li>
          <li>• Use cores diferentes para cada status (positivo, notificado, tratamento)</li>
          <li>• O mapa será atualizado automaticamente</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleMyMapsView;
