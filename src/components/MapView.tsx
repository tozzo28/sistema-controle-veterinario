import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertTriangle, Activity, Shield } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

// Coordenadas aproximadas de Paraguaçu, MG
const PARAGUACU_COORDS = [-21.5497, -45.7378];

// Função para geocodificar endereços (simulada para Paraguaçu)
const geocodeAddress = (endereco: string, area: string, quadra: string) => {
  // Simulação de geocodificação baseada na área e quadra
  const baseLat = PARAGUACU_COORDS[0];
  const baseLng = PARAGUACU_COORDS[1];
  
  // Variação baseada na área
  const areaOffsets: { [key: string]: [number, number] } = {
    'Centro': [0, 0],
    'Norte': [0.01, 0],
    'Sul': [-0.01, 0],
    'Leste': [0, 0.01],
    'Oeste': [0, -0.01],
  };
  
  // Variação baseada na quadra
  const quadraOffsets: { [key: string]: [number, number] } = {
    'A': [0.002, 0.002],
    'B': [0.002, -0.002],
    'C': [-0.002, 0.002],
    'D': [-0.002, -0.002],
    'E': [0.004, 0],
  };
  
  const areaOffset = areaOffsets[area] || [0, 0];
  const quadraOffset = quadraOffsets[quadra] || [0, 0];
  
  // Adicionar pequena variação aleatória para simular localização específica
  const randomLat = (Math.random() - 0.5) * 0.005;
  const randomLng = (Math.random() - 0.5) * 0.005;
  
  return [
    baseLat + areaOffset[0] + quadraOffset[0] + randomLat,
    baseLng + areaOffset[1] + quadraOffset[1] + randomLng
  ];
};

// Componente para centralizar o mapa
const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({ leishmaniasisCases }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(PARAGUACU_COORDS);

  // Processar casos para o mapa
  const mapCases = leishmaniasisCases.map(case_ => {
    const coords = geocodeAddress(case_.endereco || '', case_.area, case_.quadra);
    return {
      ...case_,
      coordinates: coords as [number, number]
    };
  });

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
          Mapa de Casos - Paraguaçu/MG
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhum caso registrado para exibir no mapa.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estatísticas do Mapa */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Positivos</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.positivos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notificados</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.notificados}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Em Tratamento</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.tratamento}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Mapa de Casos - Paraguaçu/MG
        </h3>
        
        <div className="h-96 w-full rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <MapCenter center={mapCenter} />
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {mapCases.map((case_) => {
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
                    <div className="p-2">
                      <h4 className="font-semibold text-gray-900 mb-2">{case_.nomeAnimal}</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Tutor:</strong> {case_.nomeTutor}</p>
                        <p><strong>Tipo:</strong> {case_.tipoAnimal === 'cao' ? 'Cão' : 'Gato'}</p>
                        <p><strong>Raça:</strong> {case_.raca || 'Não informado'}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            case_.status === 'positivo' ? 'bg-red-100 text-red-800' :
                            case_.status === 'notificado' ? 'bg-yellow-100 text-yellow-800' :
                            case_.status === 'tratamento' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {case_.status === 'positivo' ? 'Positivo' :
                             case_.status === 'notificado' ? 'Notificado' :
                             case_.status === 'tratamento' ? 'Em Tratamento' :
                             case_.status}
                          </span>
                        </p>
                        <p><strong>Área:</strong> {case_.area} - Quadra {case_.quadra}</p>
                        {case_.endereco && <p><strong>Endereço:</strong> {case_.endereco}</p>}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        
        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Positivo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Notificado</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Em Tratamento</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
