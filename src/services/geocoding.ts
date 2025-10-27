// Serviço de geocodificação usando múltiplas APIs para maior precisão
export interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
  success: boolean;
  error?: string;
  source?: string; // Qual API foi usada
  confidence?: number; // Nível de confiança (0-1)
}

// Função para geocodificar usando Nominatim (OpenStreetMap) com estratégias avançadas
const geocodeWithNominatim = async (address: string): Promise<GeocodingResult> => {
  try {
    console.log('🔍 [Nominatim] Geocodificando:', address);

    // Limpar e normalizar endereço
    const cleanAddress = address.trim().replace(/\s+/g, ' ');
    
    // Adicionar Paraguaçu Paulista, SP se não estiver no endereço
    let searchAddress = cleanAddress;
    if (!cleanAddress.toLowerCase().includes('paraguaçu') && !cleanAddress.toLowerCase().includes('paulista')) {
      searchAddress = `${cleanAddress}, Paraguaçu Paulista, SP, Brasil`;
    }

    // Estratégias de busca mais específicas e precisas
    const searchStrategies = [
      // Estratégia 1: Busca estruturada (mais precisa)
      {
        url: `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(cleanAddress)}&city=Paraguaçu Paulista&state=SP&country=BR&limit=5&addressdetails=1&extratags=1`,
        name: 'Busca Estruturada'
      },
      // Estratégia 2: Endereço completo com bounding box (área específica de Paraguaçu)
      {
        url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=5&countrycodes=br&addressdetails=1&bounded=1&viewbox=-50.65,-22.35,-50.50,-22.50&extratags=1`,
        name: 'Busca com Área Limitada'
      },
      // Estratégia 3: Busca detalhada com múltiplos resultados
      {
        url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=5&countrycodes=br&addressdetails=1&extratags=1&namedetails=1`,
        name: 'Busca Detalhada'
      },
      // Estratégia 4: Busca simples com cidade
      {
        url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)} Paraguaçu Paulista SP&limit=3&countrycodes=br&addressdetails=1`,
        name: 'Busca Simples'
      }
    ];

    for (let i = 0; i < searchStrategies.length; i++) {
      const strategy = searchStrategies[i];
      console.log(`🌐 [Nominatim] ${strategy.name} (${i + 1}/${searchStrategies.length}):`, strategy.url);

      try {
        const response = await fetch(strategy.url);
        console.log(`📡 [Nominatim] Status da resposta (${strategy.name}):`, response.status);
        
        if (!response.ok) {
          console.log(`❌ [Nominatim] Erro HTTP (${strategy.name}):`, response.status);
          continue;
        }

        const data = await response.json();
        console.log(`📊 [Nominatim] Dados recebidos (${strategy.name}):`, data);

        if (data && data.length > 0) {
          // Filtrar resultados para encontrar o mais específico
          const bestResult = findBestNominatimResult(data, cleanAddress);
          
          if (bestResult) {
            const confidence = calculateNominatimConfidence(bestResult, cleanAddress);
            console.log(`✅ [Nominatim] Resultado encontrado (${strategy.name}):`, {
              lat: bestResult.lat,
              lng: bestResult.lon,
              display_name: bestResult.display_name,
              confidence: confidence
            });

            return {
              lat: parseFloat(bestResult.lat),
              lng: parseFloat(bestResult.lon),
              address: bestResult.display_name,
              success: true,
              source: `Nominatim - ${strategy.name}`,
              confidence: confidence
            };
          }
        }
      } catch (error) {
        console.log(`❌ [Nominatim] Erro na tentativa (${strategy.name}):`, error);
        continue;
      }
    }

    console.log('❌ [Nominatim] Todas as tentativas falharam');
    return {
      lat: 0,
      lng: 0,
      address: '',
      success: false,
      error: 'Nominatim: Endereço não encontrado',
      source: 'Nominatim',
      confidence: 0
    };

  } catch (error) {
    console.error('❌ [Nominatim] Erro geral:', error);
    return {
      lat: 0,
      lng: 0,
      address: '',
      success: false,
      error: `Nominatim: ${error}`,
      source: 'Nominatim',
      confidence: 0
    };
  }
};

// Função para encontrar o melhor resultado do Nominatim
const findBestNominatimResult = (results: any[], originalAddress: string) => {
  if (!results || results.length === 0) return null;

  // Priorizar resultados que:
  // 1. Tenham número de casa (house_number)
  // 2. Sejam do tipo 'house' ou 'building'
  // 3. Estejam em Paraguaçu Paulista
  // 4. Tenham maior importância

  const scoredResults = results.map(result => {
    let score = 0;
    
    // Verificar se está em Paraguaçu Paulista
    if (result.display_name?.toLowerCase().includes('paraguaçu paulista')) {
      score += 100;
    }
    
    // Priorizar resultados com número de casa
    if (result.address?.house_number) {
      score += 50;
    }
    
    // Priorizar tipos específicos
    if (result.type === 'house' || result.type === 'building') {
      score += 30;
    } else if (result.type === 'residential') {
      score += 20;
    }
    
    // Priorizar classes específicas
    if (result.class === 'building' || result.class === 'place') {
      score += 20;
    }
    
    // Usar importância do Nominatim
    if (result.importance) {
      score += result.importance * 10;
    }
    
    // Verificar se o endereço original contém elementos do resultado
    const addressLower = originalAddress.toLowerCase();
    if (result.address?.road && addressLower.includes(result.address.road.toLowerCase())) {
      score += 25;
    }
    
    return { ...result, score };
  });

  // Ordenar por score e retornar o melhor
  scoredResults.sort((a, b) => b.score - a.score);
  
  console.log('🏆 [Nominatim] Resultados ordenados por score:', scoredResults.map(r => ({
    display_name: r.display_name,
    type: r.type,
    class: r.class,
    score: r.score,
    house_number: r.address?.house_number
  })));
  
  return scoredResults[0];
};

// Função para calcular confiança do resultado Nominatim
const calculateNominatimConfidence = (result: any, originalAddress: string): number => {
  let confidence = 0.3; // Base mínima
  
  // Aumentar confiança se tem número de casa
  if (result.address?.house_number) {
    confidence += 0.4;
  }
  
  // Aumentar confiança se é tipo específico
  if (result.type === 'house' || result.type === 'building') {
    confidence += 0.2;
  }
  
  // Aumentar confiança se tem importância alta
  if (result.importance && result.importance > 0.5) {
    confidence += 0.1;
  }
  
  return Math.min(confidence, 1.0);
};

// Função para geocodificar usando ViaCEP + coordenadas aproximadas
const geocodeWithViaCEP = async (address: string): Promise<GeocodingResult> => {
  try {
    console.log('🔍 [ViaCEP] Tentando extrair CEP do endereço:', address);
    
    // Tentar extrair CEP do endereço
    const cepMatch = address.match(/\d{5}-?\d{3}/);
    if (!cepMatch) {
      console.log('❌ [ViaCEP] CEP não encontrado no endereço');
      return {
        lat: 0,
        lng: 0,
        address: '',
        success: false,
        error: 'CEP não encontrado',
        source: 'ViaCEP',
        confidence: 0
      };
    }
    
    const cep = cepMatch[0].replace('-', '');
    console.log('🔍 [ViaCEP] CEP encontrado:', cep);
    
    // Verificar se é um CEP genérico (terminado em 000)
    if (cep.endsWith('000')) {
      console.log('⚠️ [ViaCEP] CEP genérico detectado, pulando ViaCEP');
      return {
        lat: 0,
        lng: 0,
        address: '',
        success: false,
        error: 'CEP genérico (terminado em 000)',
        source: 'ViaCEP',
        confidence: 0
      };
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 [ViaCEP] Dados recebidos:', data);
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    // ViaCEP não fornece coordenadas, então usar coordenadas aproximadas de Paraguaçu
    // com offset baseado no CEP para distribuição
    const baseLat = -22.4203497;
    const baseLng = -50.5792099;
    
    // Usar CEP para gerar offset único
    const cepNum = parseInt(cep);
    const latOffset = ((cepNum % 1000) - 500) / 10000; // Variação menor, mais precisa
    const lngOffset = (((cepNum >> 3) % 1000) - 500) / 10000;
    
    const finalLat = baseLat + latOffset;
    const finalLng = baseLng + lngOffset;
    
    console.log('✅ [ViaCEP] Coordenadas geradas:', { lat: finalLat, lng: finalLng });
    
    return {
      lat: finalLat,
      lng: finalLng,
      address: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}, ${cep}`,
      success: true,
      source: 'ViaCEP + Coordenadas Aproximadas',
      confidence: 0.6
    };
    
  } catch (error) {
    console.error('❌ [ViaCEP] Erro:', error);
    return {
      lat: 0,
      lng: 0,
      address: '',
      success: false,
      error: `ViaCEP: ${error}`,
      source: 'ViaCEP',
      confidence: 0
    };
  }
};

// Função para geocodificar usando Photon (OpenStreetMap alternativo)
const geocodeWithPhoton = async (address: string): Promise<GeocodingResult> => {
  try {
    console.log('🔍 [Photon] Geocodificando:', address);

    // Limpar e normalizar endereço
    const cleanAddress = address.trim().replace(/\s+/g, ' ');
    
    // URL da API Photon (Komoot)
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanAddress)}&limit=5&lang=pt&bbox=-50.65,-22.50,-50.50,-22.35`;
    
    console.log('🌐 [Photon] URL:', url);
    
    const response = await fetch(url);
    console.log('📡 [Photon] Status da resposta:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 [Photon] Dados recebidos:', data);
    
    if (!data.features || data.features.length === 0) {
      return {
        lat: 0,
        lng: 0,
        address: '',
        success: false,
        error: 'Nenhum resultado encontrado',
        source: 'Photon',
        confidence: 0
      };
    }
    
    // Filtrar resultados para Paraguaçu Paulista
    const paraguacuResults = data.features.filter((feature: any) => {
      const props = feature.properties;
      return props.city?.toLowerCase().includes('paraguaçu') || 
             props.name?.toLowerCase().includes('paraguaçu') ||
             props.state?.toLowerCase().includes('são paulo') ||
             props.state?.toLowerCase().includes('sp');
    });
    
    const bestResult = paraguacuResults.length > 0 ? paraguacuResults[0] : data.features[0];
    const coords = bestResult.geometry.coordinates; // [lng, lat] no GeoJSON
    
    console.log('✅ [Photon] Resultado encontrado:', {
      lat: coords[1],
      lng: coords[0],
      properties: bestResult.properties
    });
    
    return {
      lat: coords[1],
      lng: coords[0],
      address: bestResult.properties.name || bestResult.properties.street || address,
      success: true,
      source: 'Photon (Komoot)',
      confidence: paraguacuResults.length > 0 ? 0.7 : 0.4
    };
    
  } catch (error) {
    console.error('❌ [Photon] Erro:', error);
    return {
      lat: 0,
      lng: 0,
      address: '',
      success: false,
      error: `Photon: ${error}`,
      source: 'Photon',
      confidence: 0
    };
  }
};

// Função para geocodificar usando LocationIQ (alternativa gratuita)
const geocodeWithLocationIQ = async (address: string): Promise<GeocodingResult> => {
  try {
    console.log('🔍 [LocationIQ] Geocodificando:', address);

    // Limpar e normalizar endereço
    const cleanAddress = address.trim().replace(/\s+/g, ' ');
    
    // URL da API LocationIQ (sem chave, limitada)
    const url = `https://us1.locationiq.com/v1/search.php?key=demo&q=${encodeURIComponent(cleanAddress)}&format=json&limit=5&countrycodes=br&addressdetails=1&bounded=1&viewbox=-50.65,-22.35,-50.50,-22.50`;
    
    console.log('🌐 [LocationIQ] URL:', url);
    
    const response = await fetch(url);
    console.log('📡 [LocationIQ] Status da resposta:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 [LocationIQ] Dados recebidos:', data);
    
    if (!data || data.length === 0) {
      return {
        lat: 0,
        lng: 0,
        address: '',
        success: false,
        error: 'Nenhum resultado encontrado',
        source: 'LocationIQ',
        confidence: 0
      };
    }
    
    // Encontrar melhor resultado
    const bestResult = data[0];
    
    console.log('✅ [LocationIQ] Resultado encontrado:', {
      lat: bestResult.lat,
      lng: bestResult.lon,
      display_name: bestResult.display_name
    });
    
    return {
      lat: parseFloat(bestResult.lat),
      lng: parseFloat(bestResult.lon),
      address: bestResult.display_name,
      success: true,
      source: 'LocationIQ',
      confidence: 0.6
    };
    
  } catch (error) {
    console.error('❌ [LocationIQ] Erro:', error);
    return {
      lat: 0,
      lng: 0,
      address: '',
      success: false,
      error: `LocationIQ: ${error}`,
      source: 'LocationIQ',
      confidence: 0
    };
  }
};

// Função principal de geocodificação com múltiplas APIs
export const geocodeAddress = async (address: string): Promise<GeocodingResult> => {
  try {
    // Se não há endereço, retorna erro
    if (!address || address.trim() === '') {
      return {
        lat: 0,
        lng: 0,
        address: '',
        success: false,
        error: 'Endereço não fornecido',
        source: 'Validação',
        confidence: 0
      };
    }

    console.log('🎯 [GEOCODING] Iniciando geocodificação:', address);

    // Array de APIs para tentar em ordem de prioridade
    const geocodingAPIs = [
      { name: 'Nominatim', func: geocodeWithNominatim, minConfidence: 0.5 },
      { name: 'Photon', func: geocodeWithPhoton, minConfidence: 0.4 },
      { name: 'LocationIQ', func: geocodeWithLocationIQ, minConfidence: 0.4 },
      { name: 'ViaCEP', func: geocodeWithViaCEP, minConfidence: 0.3 }
    ];

    let bestResult: GeocodingResult | null = null;

    // Tentar cada API em ordem
    for (const api of geocodingAPIs) {
      console.log(`🔄 [GEOCODING] Tentando ${api.name}...`);
      
      try {
        const result = await api.func(address);
        
        if (result.success && result.confidence && result.confidence >= api.minConfidence) {
          console.log(`✅ [GEOCODING] ${api.name} bem-sucedido com confiança ${Math.round(result.confidence * 100)}%`);
          return result;
        } else if (result.success && (!bestResult || (result.confidence || 0) > (bestResult.confidence || 0))) {
          // Guardar o melhor resultado mesmo se não atingir a confiança mínima
          bestResult = result;
          console.log(`⚠️ [GEOCODING] ${api.name} com baixa confiança, guardando como backup`);
        }
      } catch (error) {
        console.log(`❌ [GEOCODING] ${api.name} falhou:`, error);
        continue;
      }
    }

    // Se temos um resultado backup, usar ele
    if (bestResult) {
      console.log(`⚠️ [GEOCODING] Usando melhor resultado disponível (${bestResult.source})`);
      return bestResult;
    }

    // Se tudo falhou, retornar erro
    console.log('❌ [GEOCODING] Todas as APIs falharam');
    return {
      lat: 0,
      lng: 0,
      address: '',
      success: false,
      error: 'Endereço não encontrado em nenhuma API',
      source: 'Múltiplas APIs',
      confidence: 0
    };

  } catch (error) {
    console.error('❌ [GEOCODING] Erro geral:', error);
    return {
      lat: 0,
      lng: 0,
      address: '',
      success: false,
      error: `Erro geral: ${error}`,
      source: 'Sistema',
      confidence: 0
    };
  }
};

// Função para geocodificar com fallback (mantida para compatibilidade)
export const geocodeWithFallback = async (address: string, area: string, quadra: string): Promise<GeocodingResult> => {
  console.log('🔄 [FALLBACK] Iniciando geocodificação com fallback');
  
  // Tentar geocodificação principal primeiro
  const result = await geocodeAddress(address);
  
  // Se foi bem-sucedido e tem confiança razoável, usar o resultado
  if (result.success && result.confidence && result.confidence > 0.3) {
    console.log('✅ [FALLBACK] Geocodificação principal bem-sucedida');
    return result;
  }
  
  // Se falhou ou tem baixa confiança, usar fallback baseado em área/quadra
  console.log('🔄 [FALLBACK] Usando coordenadas distribuídas baseadas em área/quadra');
  
  // Coordenadas base de Paraguaçu Paulista, SP
  const baseLat = -22.4203497;
  const baseLng = -50.5792099;
  
  // Gerar hash único baseado no endereço + área + quadra
  const hashString = `${address}-${area}-${quadra}`;
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Converter para 32bit integer
  }
  hash = Math.abs(hash);
  
  // Usar hash para gerar offset consistente dentro da área real de Paraguaçu Paulista
  // Área aproximada da cidade: ~10km x 10km
  const latOffset = ((hash % 1000) - 500) / 10000; // Variação de ~0.05 graus (~5.5km)
  const lngOffset = (((hash >> 10) % 1000) - 500) / 10000;
  
  const finalLat = baseLat + latOffset;
  const finalLng = baseLng + lngOffset;
  
  console.log('📍 [FALLBACK] Coordenadas distribuídas:', { 
    lat: finalLat, 
    lng: finalLng,
    endereco: address,
    area: area,
    quadra: quadra,
    hash: hash,
    latOffset: latOffset,
    lngOffset: lngOffset
  });
  
  return {
    lat: finalLat,
    lng: finalLng,
    address: `${address} (Paraguaçu Paulista, SP - Área ${area}, Quadra ${quadra})`,
    success: true,
    source: 'Fallback Distribuído',
    confidence: 0.2
  };
};