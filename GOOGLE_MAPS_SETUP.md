# Configuração do Google Maps API

## 🗺️ Para usar geocodificação precisa com Google Maps:

### 1. Obter API Key
1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Geocoding API"
4. Crie uma chave de API

### 2. Configurar no Netlify
1. Acesse o painel do Netlify
2. Vá em "Site settings" > "Environment variables"
3. Adicione a variável:
   - **Key**: `VITE_GOOGLE_MAPS_API_KEY`
   - **Value**: sua_chave_do_google_maps

### 3. Benefícios
- ✅ Geocodificação precisa de endereços reais
- ✅ Coordenadas exatas para Paraguaçu Paulista
- ✅ Marcadores em posições corretas
- ✅ Fallback inteligente se API não estiver configurada

### 4. Fallback
Se a API key não estiver configurada, o sistema usa:
- Coordenadas distribuídas de Paraguaçu Paulista
- Hash-based para consistência
- Variação inteligente dentro da cidade

## 🚀 Como funciona:
1. Tenta geocodificar com Google Maps primeiro
2. Se falhar ou não tiver API key, usa fallback
3. Logs detalhados para debug
4. Marcadores sempre aparecem no mapa
