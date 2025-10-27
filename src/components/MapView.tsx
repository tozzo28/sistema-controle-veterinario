import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertTriangle, Activity, Shield, RefreshCw } from 'lucide-react';
import { geocodeWithFallback } from '../services/geocoding';

// Suprimir warnings obsoletos do Mozilla
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('mozPressure') || args[0]?.includes?.('mozInputSource')) {
    return; // Suprimir warnings específicos
  }
  originalWarn.apply(console, args);
};
import 'leaflet/dist/leaflet.css';

// Suprimir warnings de APIs obsoletas do Leaflet
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string' && (
    message.includes('mozPressure') || 
    message.includes('mozInputSource') ||
    message.includes('MouseEvent.mozPressure') ||
    message.includes('MouseEvent.mozInputSource')
  )) {
    return; // Suprimir esses warnings específicos
  }
  originalConsoleWarn.apply(console, args);
};

// Fix para ícones do Leaflet - usando URLs mais confiáveis
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Configurações para evitar bloqueios de recursos
L.Icon.Default.prototype.options.crossOrigin = 'anonymous';

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
  endereco?: string;
}

interface MapViewProps {
  leishmaniasisCases: LeishmaniasisCase[];
}

// Coordenadas de Paraguaçu, SP (fallback)
const PARAGUACU_COORDS: [number, number] = [-22.4114, -50.5739];

// Componente para centralizar o mapa
  const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    
    useEffect(() => {
      if (map && center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
        const setMapView = () => {
          try {
            // Verificar se o mapa está realmente pronto
            if (map && map.getContainer() && map.getContainer().querySelector('.leaflet-tile-pane')) {
              map.setView(center, 13);
            } else {
              // Se não estiver pronto, tentar novamente em 100ms
              setTimeout(setMapView, 100);
            }
          } catch (error) {
            console.error('Erro ao centralizar mapa:', error);
          }
        };
        
        // Aguardar um pouco antes de tentar centralizar
        setTimeout(setMapView, 300);
      }
    }, [map, center]);
    
    return null;
  };

const MapView: React.FC<MapViewProps> = ({ leishmaniasisCases }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(PARAGUACU_COORDS);
  const [mapCases, setMapCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Configurar ícones personalizados para evitar OpaqueResponseBlocking
  useEffect(() => {
    // Desabilitar ícones padrão do Leaflet para evitar OpaqueResponseBlocking
    L.Icon.Default.prototype.options.iconUrl = '';
    L.Icon.Default.prototype.options.shadowUrl = '';
    
    const createCustomIcon = (color: string) => {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    };
    
    // Armazenar ícones personalizados
    (window as any).customIcons = {
      red: createCustomIcon('#ef4444'),
      orange: createCustomIcon('#f97316'),
      green: createCustomIcon('#22c55e'),
      blue: createCustomIcon('#3b82f6'),
      purple: createCustomIcon('#a855f7')
    };
  }, []);

  // Função para processar casos
  const processCases = async () => {
    console.log('🔄 Processando casos para o mapa...', leishmaniasisCases);
    setIsLoading(true);
    
    const processedCases = await Promise.all(
      leishmaniasisCases.map(async (case_, index) => {
        console.log(`📍 Processando caso ${index + 1}:`, case_.nomeAnimal, case_.endereco);
        
        const geocodingResult = await geocodeWithFallback(
          case_.endereco || '', 
          case_.area, 
          case_.quadra
        );
        
        console.log(`✅ Resultado geocodificação para ${case_.nomeAnimal}:`, geocodingResult);
        
        return {
          ...case_,
          coordinates: [geocodingResult.lat, geocodingResult.lng] as [number, number],
          geocodedAddress: geocodingResult.address,
          geocodingSuccess: geocodingResult.success,
          geocodingSource: geocodingResult.source,
          geocodingConfidence: geocodingResult.confidence
        };
      })
    );
    
    console.log('🗺️ Casos processados:', processedCases);
    const validCases = processedCases.filter(c => 
      c.coordinates && 
      c.coordinates.length === 2 && 
      !isNaN(c.coordinates[0]) && 
      !isNaN(c.coordinates[1])
    );
    console.log('📍 Casos com coordenadas válidas:', validCases.length, 'de', processedCases.length);
    console.log('📍 Detalhes dos casos válidos:', validCases.map(c => ({
      nome: c.nomeAnimal,
      status: c.status,
      coordinates: c.coordinates
    })));
    setMapCases(processedCases);
    setIsLoading(false);
  };

  // Processar casos para o mapa com geocodificação real
  useEffect(() => {
    processCases();
  }, [leishmaniasisCases, refreshKey]);

  // Função para forçar refresh
  const handleRefresh = () => {
    console.log('🔄 Forçando refresh do mapa...');
    setRefreshKey(prev => prev + 1);
  };

  // Estatísticas do mapa
  const stats = {
    total: leishmaniasisCases.length,
    positivos: leishmaniasisCases.filter(c => c.status === 'positivo').length,
    notificados: leishmaniasisCases.filter(c => c.status === 'notificado').length,
    tratamento: leishmaniasisCases.filter(c => c.status === 'tratamento').length,
  };

  if (leishmaniasisCases.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Mapa de Casos - Paraguaçu/SP
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhum caso registrado para exibir no mapa.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Mapa de Casos - Paraguaçu/SP
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando localizações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Estatísticas do Mapa */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Positivos</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.positivos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Notificados</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.notificados}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Em Tratamento</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.tratamento}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            Mapa de Casos - Paraguaçu/SP
          </h3>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
        
        <div className="h-80 sm:h-96 md:h-[500px] w-full rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
            zoomControl={true}
            touchZoom={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
          >
            <MapCenter center={mapCenter} />
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
              subdomains={[]}
            />
            
            {mapCases.filter(case_ => 
              case_.coordinates && 
              case_.coordinates.length === 2 && 
              !isNaN(case_.coordinates[0]) && 
              !isNaN(case_.coordinates[1])
            ).map((case_) => {
              console.log('📍 Renderizando marcador:', {
                nome: case_.nomeAnimal,
                status: case_.status,
                coordinates: case_.coordinates
              });
              // Cor do marcador baseada no status
              const getMarkerColor = (status: string) => {
                switch (status) {
                  case 'positivo': return 'red';
                  case 'notificado': return 'orange';
                  case 'tratamento': return 'blue';
                  default: return 'gray';
                }
              };

              // Ícone personalizado
              const customIcon = new L.DivIcon({
                className: 'custom-marker',
                html: `<div style="
                  background-color: ${getMarkerColor(case_.status)};
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              });

              return (
                <Marker
                  key={case_.id}
                  position={case_.coordinates}
                  icon={customIcon}
                >
                        <Popup>
                          <div className="p-3 max-w-xs sm:max-w-sm">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{case_.nomeAnimal}</h4>
                            <div className="space-y-2 text-xs sm:text-sm">
                              <p><strong>Tutor:</strong> {case_.nomeTutor}</p>
                              <p><strong>Tipo:</strong> {case_.tipoAnimal === 'cao' ? 'Cão' : 'Gato'}</p>
                              <p><strong>Raça:</strong> {case_.raca || 'Não informado'}</p>
                              <p><strong>Status:</strong> 
                                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                  case_.status === 'positivo' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  case_.status === 'notificado' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  case_.status === 'tratamento' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {case_.status === 'positivo' ? 'Positivo' :
                                   case_.status === 'notificado' ? 'Notificado' :
                                   case_.status === 'tratamento' ? 'Em Tratamento' :
                                   case_.status}
                                </span>
                              </p>
                              <p><strong>Área:</strong> {case_.area} - Quadra {case_.quadra}</p>
                              <p><strong>Localização:</strong> {case_.geocodedAddress}</p>
                              {case_.geocodingSource && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  <strong>Fonte:</strong> {case_.geocodingSource}
                                </p>
                              )}
                              {case_.geocodingConfidence && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  <strong>Confiança:</strong> {Math.round(case_.geocodingConfidence * 100)}%
                                </p>
                              )}
                              {!case_.geocodingSuccess && (
                                <p className="text-orange-600 text-xs">
                                  <span className="font-semibold">⚠️</span> Localização aproximada
                                </p>
                              )}
                            </div>
                          </div>
                        </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        
        {/* Legenda */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full mr-1 sm:mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Positivo</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-1 sm:mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Notificado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-1 sm:mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Em Tratamento</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
