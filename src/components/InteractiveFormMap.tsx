import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Target, RefreshCw, CheckCircle } from 'lucide-react';
import { geocodeAddress } from '../services/geocoding';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet - Desabilitar ícones padrão e usar CSS
L.Icon.Default.prototype.options.iconUrl = '';
L.Icon.Default.prototype.options.iconRetinaUrl = '';
L.Icon.Default.prototype.options.shadowUrl = '';

// Criar ícone customizado usando DivIcon (CSS puro)
const createCustomIcon = (isManual: boolean = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 25px;
      height: 25px;
      background-color: ${isManual ? '#3b82f6' : '#ef4444'};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        color: white;
        font-size: 12px;
        font-weight: bold;
        transform: rotate(45deg);
      ">${isManual ? '🎯' : '📍'}</div>
    </div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25]
  });
};

interface InteractiveFormMapProps {
  address: string;
  onCoordinatesChange: (lat: number, lng: number, address: string, isManual: boolean) => void;
  initialLat?: number;
  initialLng?: number;
}

// Componente para centralizar o mapa
const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map && center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      const setMapView = () => {
        try {
          if (map && map.getContainer() && map.getContainer().querySelector('.leaflet-tile-pane')) {
            map.setView(center, 15);
          } else {
            setTimeout(setMapView, 100);
          }
        } catch (error) {
          console.error('Erro ao centralizar mapa:', error);
        }
      };
      setTimeout(setMapView, 300);
    }
  }, [map, center]);
  
  return null;
};

// Componente para capturar cliques no mapa
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      console.log('🖱️ [MAPA] Clique detectado:', { lat, lng });
      onMapClick(lat, lng);
    },
  });
  
  return null;
};

const InteractiveFormMap: React.FC<InteractiveFormMapProps> = ({
  address,
  onCoordinatesChange,
  initialLat,
  initialLng
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-22.4203497, -50.5792099]); // Centro de Paraguaçu Paulista
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geocodingResult, setGeocodingResult] = useState<any>(null);
  const [isManualPosition, setIsManualPosition] = useState(false);
  const mapRef = useRef<any>(null);

  // Inicializar com coordenadas iniciais se fornecidas
  useEffect(() => {
    if (initialLat && initialLng && !isNaN(initialLat) && !isNaN(initialLng)) {
      const position: [number, number] = [initialLat, initialLng];
      setMapCenter(position);
      setMarkerPosition(position);
      setIsManualPosition(true);
      console.log('🎯 [MAPA] Coordenadas iniciais carregadas:', { lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  // Geocodificar endereço quando mudado
  useEffect(() => {
    if (address && address.trim() && address.length > 10) {
      geocodeAddressOnMap();
    }
  }, [address]);

  const geocodeAddressOnMap = async () => {
    if (!address || address.trim().length < 10) return;

    setIsLoading(true);
    console.log('🔍 [MAPA] Geocodificando endereço:', address);

    try {
      const result = await geocodeAddress(address);
      
      if (result.success && result.lat && result.lng) {
        const position: [number, number] = [result.lat, result.lng];
        setMapCenter(position);
        setMarkerPosition(position);
        setGeocodingResult(result);
        setIsManualPosition(false);
        
        console.log('✅ [MAPA] Geocodificação bem-sucedida:', result);
        
        // Notificar componente pai
        onCoordinatesChange(result.lat, result.lng, result.address, false);
      } else {
        console.log('⚠️ [MAPA] Geocodificação falhou, mantendo centro de Paraguaçu');
        setGeocodingResult(null);
        setMarkerPosition(null);
      }
    } catch (error) {
      console.error('❌ [MAPA] Erro na geocodificação:', error);
      setGeocodingResult(null);
      setMarkerPosition(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log('🖱️ [MAPA] Posição manual selecionada:', { lat, lng });
    
    const position: [number, number] = [lat, lng];
    setMarkerPosition(position);
    setIsManualPosition(true);
    
    // Notificar componente pai
    onCoordinatesChange(lat, lng, `${address} (Posição Ajustada Manualmente)`, true);
  };

  const handleRefresh = () => {
    if (address && address.trim()) {
      geocodeAddressOnMap();
    }
  };

  return (
    <div className="space-y-3">
      {/* Cabeçalho do Mapa */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Localização no Mapa
          </span>
          {isLoading && (
            <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          )}
        </div>
        
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading || !address.trim()}
          className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Status da Geocodificação */}
      {geocodingResult && !isManualPosition && (
        <div className={`flex items-center space-x-2 p-2 rounded border ${
          (geocodingResult.confidence || 0) >= 0.8 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : (geocodingResult.confidence || 0) >= 0.5
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <CheckCircle className={`w-4 h-4 ${
            (geocodingResult.confidence || 0) >= 0.8 
              ? 'text-green-500'
              : (geocodingResult.confidence || 0) >= 0.5
              ? 'text-blue-500'
              : 'text-yellow-500'
          }`} />
          <div className={`text-xs ${
            (geocodingResult.confidence || 0) >= 0.8 
              ? 'text-green-700 dark:text-green-300'
              : (geocodingResult.confidence || 0) >= 0.5
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-yellow-700 dark:text-yellow-300'
          }`}>
            <span className="font-medium">
              {(geocodingResult.confidence || 0) >= 0.8 ? '✅ Alta Precisão' : 
               (geocodingResult.confidence || 0) >= 0.5 ? '📍 Boa Precisão' : '⚠️ Precisão Média'}:
            </span> {geocodingResult.source} ({Math.round((geocodingResult.confidence || 0) * 100)}%)
          </div>
        </div>
      )}

      {isManualPosition && (
        <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <Target className="w-4 h-4 text-blue-500" />
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <span className="font-medium">Posição ajustada manualmente</span> - 100% precisa
          </div>
        </div>
      )}

      {/* Mapa Interativo */}
      <div className="relative">
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={15}
          style={{ height: '300px', width: '100%' }}
          className="rounded-lg border border-gray-300 dark:border-gray-600"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapCenter center={mapCenter} />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Marcador da posição */}
          {markerPosition && (
            <Marker 
              position={markerPosition}
              icon={createCustomIcon(isManualPosition)}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-medium">
                    {isManualPosition ? '🎯 Posição Manual (100% Precisa)' : '📍 Posição Geocodificada'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Coordenadas:</strong><br />
                    Lat: {markerPosition[0].toFixed(6)}<br />
                    Lng: {markerPosition[1].toFixed(6)}
                  </p>
                  {geocodingResult && !isManualPosition && (
                    <div className="text-xs text-gray-500 mt-2">
                      <p><strong>Fonte:</strong> {geocodingResult.source}</p>
                      <p><strong>Confiança:</strong> {Math.round((geocodingResult.confidence || 0) * 100)}%</p>
                    </div>
                  )}
                  {isManualPosition && (
                    <p className="text-xs text-blue-600 mt-2">
                      <strong>✅ Posição ajustada manualmente</strong>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-blue-500 font-medium">Localizando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Instruções */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>💡 <strong>Como usar:</strong></p>
        <ul className="ml-4 space-y-0.5">
          <li>• O mapa mostra a localização encontrada automaticamente</li>
          <li>• <strong>Clique no mapa</strong> para ajustar a posição exata</li>
          <li>• Use o botão "Atualizar" para re-geocodificar o endereço</li>
          <li>• Posições manuais têm 100% de precisão</li>
        </ul>
      </div>
    </div>
  );
};

export default InteractiveFormMap;
