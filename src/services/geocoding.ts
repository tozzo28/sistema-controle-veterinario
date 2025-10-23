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

    // URL do Nominatim para geocodificação
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1&countrycodes=br&addressdetails=1`;
    
    console.log('🌐 URL de busca:', nominatimUrl);

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Sistema-Controle-Veterinario/1.0',
        'Accept': 'application/json'
      }
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 Dados recebidos:', data);

    if (!data || data.length === 0) {
      console.log('❌ Nenhum resultado encontrado');
      return {
        lat: 0,
        lng: 0,
        address: address,
        success: false,
        error: 'Endereço não encontrado'
      };
    }

    const result = data[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const formattedAddress = result.display_name || address;

    console.log('✅ Geocodificação bem-sucedida:', { lat, lng, address: formattedAddress });

    return {
      lat,
      lng,
      address: formattedAddress,
      success: true
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

  // Se falhar, tenta geocodificar com área e quadra
  const areaAddress = `${area}, Paraguaçu Paulista, SP, Brasil`;
  const areaResult = await geocodeAddress(areaAddress);
  
  if (areaResult.success) {
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

  // Se tudo falhar, usa coordenadas de Paraguaçu/SP
  return {
    lat: -22.4114,
    lng: -50.5739,
    address: `Paraguaçu Paulista, SP (coordenadas aproximadas)`,
    success: false,
    error: 'Usando coordenadas aproximadas de Paraguaçu/SP'
  };
};
