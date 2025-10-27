import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Shield, Calendar, User, RefreshCw } from 'lucide-react';
import { geocodeWithFallback, geocodeWithManualCoordinates } from '../services/geocoding';

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

interface RabiesVaccineRecord {
  id: number;
  nomeAnimal: string;
  tipo: string;
  nomeTutor: string;
  dataVacinacao: string;
  localVacinacao: string;
  area: string;
  quadra: string;
  loteVacina: string;
  dosePerdida: boolean;
  endereco?: string;
  latitude?: number;
  longitude?: number;
}

interface VaccinationMapViewProps {
  vaccinationRecords: RabiesVaccineRecord[];
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

const VaccinationMapView: React.FC<VaccinationMapViewProps> = ({ vaccinationRecords }) => {
  console.log('🗺️ [VaccinationMapView] Recebidos registros:', vaccinationRecords);
  const [mapCenter, setMapCenter] = useState<[number, number]>(PARAGUACU_COORDS);
  const [mapRecords, setMapRecords] = useState<any[]>([]);
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

  // Função para processar registros
  const processRecords = async () => {
    console.log('🔄 Processando registros de vacinação...', vaccinationRecords);
    setIsLoading(true);
    
    const processedRecords = await Promise.all(
      vaccinationRecords.map(async (record, index) => {
        console.log(`📍 Processando registro ${index + 1}:`, record.nomeAnimal, record.endereco);
        
        let geocodingResult;
        
        // Verificar se tem coordenadas manuais (100% precisão)
        if (record.latitude && record.longitude && !isNaN(record.latitude) && !isNaN(record.longitude)) {
          console.log(`🎯 Usando coordenadas manuais 100% precisas para ${record.nomeAnimal}:`, { lat: record.latitude, lng: record.longitude });
          geocodingResult = await geocodeWithManualCoordinates(
            record.endereco || 'Endereço com coordenadas manuais',
            record.latitude,
            record.longitude
          );
        } else {
          // Usar geocodificação automática
          geocodingResult = await geocodeWithFallback(
            record.endereco || '', 
            record.area, 
            record.quadra
          );
        }
        
        console.log(`✅ Resultado geocodificação para ${record.nomeAnimal}:`, geocodingResult);
        
        return {
          ...record,
          coordinates: [geocodingResult.lat, geocodingResult.lng] as [number, number],
          geocodedAddress: geocodingResult.address,
          geocodingSuccess: geocodingResult.success,
          geocodingSource: geocodingResult.source,
          geocodingConfidence: geocodingResult.confidence
        };
      })
    );
    
    console.log('🗺️ Registros processados:', processedRecords);
    setMapRecords(processedRecords);
    setIsLoading(false);
  };

  // Processar registros para o mapa com geocodificação real
  useEffect(() => {
    processRecords();
  }, [vaccinationRecords, refreshKey]);

  // Função para forçar refresh
  const handleRefresh = () => {
    console.log('🔄 Forçando refresh do mapa de vacinação...');
    setRefreshKey(prev => prev + 1);
  };

  // Estatísticas do mapa
  const stats = {
    total: vaccinationRecords.length,
    caes: vaccinationRecords.filter(r => r.tipo === 'cao').length,
    gatos: vaccinationRecords.filter(r => r.tipo === 'gato').length,
    dosesPerdidas: vaccinationRecords.filter(r => r.dosePerdida).length,
  };

  if (vaccinationRecords.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-green-600" />
          Mapa de Vacinações - Paraguaçu/SP
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhuma vacinação registrada para exibir no mapa.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-green-600" />
          Mapa de Vacinações - Paraguaçu/SP
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cães</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.caes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-2" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Gatos</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.gatos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2" />
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Doses Perdidas</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{stats.dosesPerdidas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
            Mapa de Vacinações - Paraguaçu/SP
          </h3>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
            
            {mapRecords.filter(record => 
              record.coordinates && 
              record.coordinates.length === 2 && 
              !isNaN(record.coordinates[0]) && 
              !isNaN(record.coordinates[1])
            ).map((record) => {
              // Cor do marcador baseada no tipo e se perdeu dose
              const getMarkerColor = (tipo: string, dosePerdida: boolean) => {
                if (dosePerdida) return 'red';
                return tipo === 'cao' ? 'blue' : 'purple';
              };

              // Ícone personalizado
              const customIcon = new L.DivIcon({
                className: 'custom-marker',
                html: `<div style="
                  background-color: ${getMarkerColor(record.tipo, record.dosePerdida)};
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
                  key={record.id}
                  position={record.coordinates}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-3 max-w-xs sm:max-w-sm">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{record.nomeAnimal}</h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <p><strong>Tutor:</strong> {record.nomeTutor}</p>
                        <p><strong>Tipo:</strong> {record.tipo === 'cao' ? 'Cão' : 'Gato'}</p>
                        <p><strong>Data:</strong> {new Date(record.dataVacinacao).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Local:</strong> {record.localVacinacao}</p>
                        <p><strong>Lote:</strong> {record.loteVacina}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            record.dosePerdida 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {record.dosePerdida ? 'Dose Perdida' : 'Vacinado'}
                          </span>
                        </p>
                        <p><strong>Área:</strong> {record.area} - Quadra {record.quadra}</p>
                        <p><strong>Localização:</strong> {record.geocodedAddress}</p>
                        {!record.geocodingSuccess && (
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

        {/* Legenda do Mapa */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-4 sm:mt-6">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Legenda</h4>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm sm:text-base">
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-1 sm:mr-2"></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Cães Vacinados</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full mr-1 sm:mr-2"></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Gatos Vacinados</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full mr-1 sm:mr-2"></div>
              <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Doses Perdidas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationMapView;
