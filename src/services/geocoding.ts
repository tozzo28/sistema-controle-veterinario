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

    // Tentar Nominatim primeiro (mais preciso para endereços específicos)
    const nominatimResult = await geocodeWithNominatim(address);
    if (nominatimResult.success && nominatimResult.confidence && nominatimResult.confidence > 0.5) {
      console.log('✅ [GEOCODING] Nominatim bem-sucedido com alta confiança');
      return nominatimResult;
    }

    // Se Nominatim falhou ou tem baixa confiança, tentar ViaCEP
    const viacepResult = await geocodeWithViaCEP(address);
    if (viacepResult.success) {
      console.log('✅ [GEOCODING] ViaCEP bem-sucedido');
      return viacepResult;
    }

    // Se ambos falharam, usar o resultado do Nominatim mesmo com baixa confiança
    if (nominatimResult.success) {
      console.log('⚠️ [GEOCODING] Usando Nominatim com baixa confiança');
      return nominatimResult;
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