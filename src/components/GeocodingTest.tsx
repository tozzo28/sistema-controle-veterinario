import React, { useState } from 'react';
import { MapPin, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { geocodeAddress } from '../services/geocoding';

const GeocodingTest: React.FC = () => {
  const [testAddress, setTestAddress] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    if (!testAddress.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const geocodingResult = await geocodeAddress(testAddress);
      setResult(geocodingResult);
    } catch (error) {
      setResult({
        success: false,
        error: 'Erro no teste: ' + (error instanceof Error ? error.message : 'Erro desconhecido')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
        Teste de Geocodificação
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Endereço para Testar
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={testAddress}
              onChange={(e) => setTestAddress(e.target.value)}
              placeholder="Ex: Rua das Flores, 123, Centro, Paraguaçu Paulista - SP"
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleTest}
              disabled={isLoading || !testAddress.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Testar</span>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Testando geocodificação...</span>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <div className="flex items-start space-x-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={`font-medium ${
                  result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {result.success ? 'Geocodificação Bem-sucedida' : 'Erro na Geocodificação'}
                </h4>
                
                {result.success ? (
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Coordenadas:</strong> {result.lat.toFixed(6)}, {result.lng.toFixed(6)}</p>
                    <p><strong>Endereço encontrado:</strong> {result.address}</p>
                  </div>
                ) : (
                  <div className="mt-2 text-sm">
                    <p><strong>Erro:</strong> {result.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p><strong>Dicas para teste:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Use endereços reais de Paraguaçu Paulista, SP</li>
            <li>Inclua rua, número e bairro</li>
            <li>Exemplo: "Rua 15 de Novembro, 123, Centro"</li>
            <li>Exemplo: "Avenida Paulista, 456, Centro, Paraguaçu Paulista - SP"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeocodingTest;
