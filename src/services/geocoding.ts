// Serviço de geocodificação usando Nominatim (OpenStreetMap)
export interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
  success: boolean;
  error?: string;
}

// Função para geocodificar um endereço
export const geocodeAddress = async (address: string): Promise<GeocodingResult> => {
  try {
    // Se não há endereço, retorna erro
    if (!address || address.trim() === '') {
      return {
        lat: 0,
        lng: 0,
        address: '',
        success: false,
        error: 'Endereço não fornecido'
      };
    }

    console.log('🔍 Geocodificando endereço:', address);

    // Adicionar Paraguaçu Paulista, SP se não estiver no endereço
    let searchAddress = address;
    if (!address.toLowerCase().includes('paraguaçu') && !address.toLowerCase().includes('paulista')) {
      searchAddress = `${address}, Paraguaçu Paulista, SP, Brasil`;
    }

    // Tentar múltiplas estratégias de busca
    const searchStrategies = [
      // Estratégia 1: Busca completa
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1&countrycodes=br&addressdetails=1`,
      // Estratégia 2: Busca mais específica para Paraguaçu
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)} Paraguaçu Paulista SP Brasil&limit=1&countrycodes=br&addressdetails=1`,
      // Estratégia 3: Busca apenas com cidade
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)} Paraguaçu Paulista&limit=1&countrycodes=br&addressdetails=1`
    ];

    for (let i = 0; i < searchStrategies.length; i++) {
      const url = searchStrategies[i];
      console.log(`🌐 Tentativa ${i + 1}/3 - URL:`, url);

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Sistema-Controle-Veterinario/1.0',
            'Accept': 'application/json'
          }
        });

        console.log(`📡 Status da resposta (tentativa ${i + 1}):`, response.status);

        if (!response.ok) {
          console.log(`❌ Erro na tentativa ${i + 1}:`, response.status);
          continue;
        }

        const data = await response.json();
        console.log(`📊 Dados recebidos (tentativa ${i + 1}):`, data);

        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          const formattedAddress = result.display_name || address;

          console.log(`✅ Geocodificação bem-sucedida (tentativa ${i + 1}):`, { lat, lng, address: formattedAddress });

          return {
            lat,
            lng,
            address: formattedAddress,
            success: true
          };
        }
      } catch (error) {
        console.log(`❌ Erro na tentativa ${i + 1}:`, error);
        continue;
      }
    }

    console.log('❌ Todas as tentativas falharam');
    return {
      lat: 0,
      lng: 0,
      address: address,
      success: false,
      error: 'Endereço não encontrado após múltiplas tentativas'
    };

  } catch (error) {
    console.error('❌ Erro na geocodificação:', error);
    return {
      lat: 0,
      lng: 0,
      address: address,
      success: false,
      error: `Erro na geocodificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
};

// Função para geocodificar com fallback para Paraguaçu/SP
export const geocodeWithFallback = async (address: string, area: string, quadra: string): Promise<GeocodingResult> => {
  // Primeiro tenta geocodificar o endereço completo
  const result = await geocodeAddress(address);
  
  if (result.success) {
    return result;
  }

  console.log('🔄 Tentando fallback com área e quadra...');

  // Se falhar, tenta geocodificar com área e quadra
  const areaAddress = `${area}, Paraguaçu Paulista, SP, Brasil`;
  const areaResult = await geocodeAddress(areaAddress);
  
  if (areaResult.success) {
    console.log('✅ Área encontrada, aplicando offset da quadra...');
    // Adiciona pequena variação baseada na quadra
    const quadraOffsets: { [key: string]: [number, number] } = {
      'A': [0.002, 0.002],
      'B': [0.002, -0.002],
      'C': [-0.002, 0.002],
      'D': [-0.002, -0.002],
      'E': [0.004, 0],
    };
    
    const offset = quadraOffsets[quadra] || [0, 0];
    const randomLat = (Math.random() - 0.5) * 0.001;
    const randomLng = (Math.random() - 0.5) * 0.001;
    
    return {
      lat: areaResult.lat + offset[0] + randomLat,
      lng: areaResult.lng + offset[1] + randomLng,
      address: `${area} - Quadra ${quadra}, Paraguaçu Paulista, SP`,
      success: true
    };
  }

  console.log('🔄 Usando coordenadas aproximadas de Paraguaçu/SP...');
  
  // Se tudo falhar, usa coordenadas de Paraguaçu/SP com variação baseada no endereço
  const baseLat = -22.4114;
  const baseLng = -50.5739;
  
  // Gerar coordenadas baseadas no hash do endereço para consistência
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    const char = address.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Usar hash para gerar offset consistente
  const latOffset = ((hash % 1000) - 500) / 100000; // Variação de ~0.005 graus
  const lngOffset = (((hash >> 10) % 1000) - 500) / 100000;
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset,
    address: `${address} (coordenadas aproximadas - Paraguaçu Paulista, SP)`,
    success: false,
    error: 'Usando coordenadas aproximadas de Paraguaçu/SP'
  };
};
