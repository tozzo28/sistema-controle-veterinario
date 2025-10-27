import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertCircle, Loader2, Target } from 'lucide-react';
import { geocodeAddress, geocodeWithManualCoordinates } from '../services/geocoding';
import PrecisionIndicator from './PrecisionIndicator';

const GoogleMapsTest: React.FC = () => {
  const [testAddress, setTestAddress] = useState('Av. Brasil, 951 - Centro, Paraguaçu Paulista - SP');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Endereços de teste para Paraguaçu Paulista
  const testAddresses = [
    'Av. Brasil, 951 - Centro, Paraguaçu Paulista - SP',
    'Av. Siqueira Campos, 2537 - Vila Nova, Paraguaçu Paulista - SP',
    'Av. Galdino, 1100 - Vila Galdino, Paraguaçu Paulista - SP',
    'Rua das Flores, 123 - Centro, Paraguaçu Paulista - SP',
    'Av. Paraguaçu, 1203 - Jardim Alvorada, Paraguaçu Paulista - SP'
  ];

  const testGeocode = async () => {
    if (!testAddress.trim()) {
      alert('Por favor, digite um endereço primeiro.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log('🧪 [TESTE] Iniciando teste de geocodificação:', testAddress);
      const geocodingResult = await geocodeAddress(testAddress);
      
      if (geocodingResult.success) {
        setResult(geocodingResult);
        console.log('✅ [TESTE] Resultado:', geocodingResult);
      } else {
        setError(geocodingResult.error || 'Endereço não encontrado');
        console.log('❌ [TESTE] Erro:', geocodingResult.error);
      }
    } catch (error) {
      setError(`Erro: ${error}`);
      console.error('❌ [TESTE] Erro geral:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testManualCoordinates = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log('🎯 [TESTE] Testando coordenadas manuais 100% precisas');
      
      // Coordenadas exatas do centro de Paraguaçu Paulista (exemplo)
      const latitude = -22.4114567;
      const longitude = -50.5739123;
      
      const geocodingResult = await geocodeWithManualCoordinates(
        testAddress,
        latitude,
        longitude
      );
      
      setResult(geocodingResult);
      console.log('✅ [TESTE] Resultado 100% preciso:', geocodingResult);
    } catch (error) {
      setError(`Erro: ${error}`);
      console.error('❌ [TESTE] Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-500 rounded-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🧪 Teste de Geocodificação Google Maps
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Teste a precisão da geocodificação com endereços reais
          </p>
        </div>
      </div>

      {/* Endereços de Teste Rápido */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          🎯 Endereços de Teste Rápido:
        </p>
        <div className="grid grid-cols-1 gap-2">
          {testAddresses.map((address, index) => (
            <button
              key={index}
              onClick={() => setTestAddress(address)}
              className={`text-left p-2 rounded text-xs transition-colors ${
                testAddress === address
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {address}
            </button>
          ))}
        </div>
      </div>

      {/* Campo de Teste */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Endereço para Teste:
          </label>
          <textarea
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Digite um endereço de Paraguaçu Paulista..."
          />
        </div>

        {/* Botões de Teste */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={testGeocode}
            disabled={isLoading || !testAddress.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            <span>
              {isLoading ? 'Testando Geocodificação...' : 'Testar com APIs'}
            </span>
          </button>
          
          <button
            onClick={() => testManualCoordinates()}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>Testar 100% Preciso</span>
          </button>
        </div>
      </div>

      {/* Resultado do Teste */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                ✅ Geocodificação Bem-Sucedida!
              </p>
              <div className="mt-3">
                <PrecisionIndicator 
                  confidence={result.confidence}
                  source={result.source}
                  isManual={result.source === 'Coordenadas Manuais'}
                />
              </div>
              
              <div className="mt-3 space-y-1 text-xs text-green-700 dark:text-green-300">
                <p><strong>📍 Coordenadas:</strong> {result.lat.toFixed(7)}, {result.lng.toFixed(7)}</p>
                <p><strong>📍 Endereço Encontrado:</strong> {result.address}</p>
                <p><strong>🔍 Fonte:</strong> {result.source}</p>
                <p><strong>🎯 Confiança:</strong> {Math.round((result.confidence || 0) * 100)}%</p>
              </div>
              
              {/* Link para Google Maps */}
              <div className="mt-3">
                <a
                  href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 underline"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Ver no Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erro do Teste */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                ❌ Geocodificação Falhou
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                💡 Tente um endereço mais específico ou use coordenadas manuais
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informações sobre o Teste */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          ℹ️ Como Funciona o Teste:
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• <strong>Google Maps:</strong> Tenta primeiro (90% precisão para endereços exatos)</li>
          <li>• <strong>OpenCage:</strong> API alternativa gratuita</li>
          <li>• <strong>Nominatim:</strong> OpenStreetMap (limitado para cidades pequenas)</li>
          <li>• <strong>Conhecimento Local:</strong> Fallback com bairros de Paraguaçu</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleMapsTest;
