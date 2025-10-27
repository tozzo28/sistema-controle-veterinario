import React from 'react';
import { MapPin, ExternalLink, Target } from 'lucide-react';

const PreciseLocationGuide: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🎯 Como Obter Coordenadas Exatas
          </h4>
          
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-100 dark:border-blue-700">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                📍 Método 1: Google Maps (Mais Preciso)
              </p>
              <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4">
                <li>1. Abra o <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Google Maps</a></li>
                <li>2. Pesquise o endereço exato</li>
                <li>3. Clique no local exato no mapa</li>
                <li>4. As coordenadas aparecerão na parte inferior</li>
                <li>5. Clique nas coordenadas para copiá-las</li>
              </ol>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-100 dark:border-blue-700">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                📱 Método 2: Google Maps Mobile
              </p>
              <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4">
                <li>1. Abra o app Google Maps</li>
                <li>2. Toque e segure no local exato</li>
                <li>3. Um pin vermelho aparecerá</li>
                <li>4. Toque no pin para ver as coordenadas</li>
                <li>5. Toque nas coordenadas para copiá-las</li>
              </ol>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-700">
              <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">
                ✅ Exemplo de Coordenadas Corretas:
              </p>
              <div className="font-mono text-xs text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800/30 p-2 rounded">
                <p>Latitude: -22.4114567</p>
                <p>Longitude: -50.5739123</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <ExternalLink className="w-4 h-4 text-blue-500" />
              <a 
                href="https://maps.google.com/maps?q=Paraguaçu+Paulista,+SP" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
              >
                Abrir Google Maps para Paraguaçu Paulista
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreciseLocationGuide;
