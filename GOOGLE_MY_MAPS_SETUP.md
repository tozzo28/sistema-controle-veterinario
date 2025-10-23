# 📍 Configuração do Google My Maps

## 🎯 Passo a Passo para Configurar o Google My Maps

### 1. **Criar o Mapa no Google My Maps**

1. Acesse [Google My Maps](https://www.google.com/maps/d/)
2. Faça login com sua conta do Google
3. Clique em "Criar um novo mapa"
4. Dê um nome ao mapa: "Casos de Leishmaniose - Paraguaçu Paulista"

### 2. **Configurar o Mapa**

1. **Definir localização base:**
   - Pesquise por "Paraguaçu Paulista, SP"
   - Ajuste o zoom para mostrar toda a cidade

2. **Criar camadas por status:**
   - Clique em "Adicionar camada"
   - Renomeie para "Casos Positivos" (cor vermelha)
   - Adicione outra camada "Casos Notificados" (cor laranja)
   - Adicione outra camada "Casos em Tratamento" (cor azul)

### 3. **Adicionar Marcadores**

Para cada caso de leishmaniose:

1. **Pesquisar o endereço:**
   - Use a barra de pesquisa do Google My Maps
   - Digite o endereço completo (ex: "Av. Siqueira Campos, 2537, Vila Nova, Paraguaçu Paulista - SP")

2. **Adicionar marcador:**
   - Clique em "Adicionar ao mapa"
   - Selecione a camada correta (positivo/notificado/tratamento)
   - Personalize o título e descrição

3. **Personalizar marcador:**
   - Clique no marcador
   - Adicione título: "Nome do Animal - Status"
   - Adicione descrição com detalhes do caso
   - Escolha ícone e cor apropriados

### 4. **Compartilhar e Incorporar**

1. **Tornar público:**
   - Clique em "Compartilhar"
   - Selecione "Público na Web"
   - Copie o link de compartilhamento

2. **Obter ID do mapa:**
   - O ID está na URL do mapa
   - Exemplo: `https://www.google.com/maps/d/edit?mid=1ABC123DEF456GHI789`
   - O ID é: `1ABC123DEF456GHI789`

3. **Atualizar o código:**
   - Abra `src/components/GoogleMyMapsView.tsx`
   - Substitua `GOOGLE_MY_MAPS_ID` pelo ID real do seu mapa

### 5. **Configuração no Código**

```typescript
// Em src/components/GoogleMyMapsView.tsx
const GOOGLE_MY_MAPS_ID = "SEU_ID_AQUI"; // Substitua pelo ID real
```

## 🎨 Dicas de Personalização

### **Cores Sugeridas:**
- 🔴 **Positivos**: Vermelho (#ef4444)
- 🟠 **Notificados**: Laranja (#f97316)
- 🔵 **Tratamento**: Azul (#3b82f6)

### **Ícones Sugeridos:**
- Positivos: ⚠️ (triângulo de alerta)
- Notificados: 📋 (clipboard)
- Tratamento: 💊 (pílula)

### **Informações nos Marcadores:**
```
Título: Nome do Animal - Status
Descrição:
• Tutor: Nome do Tutor
• Endereço: Endereço Completo
• Data: Data da Notificação
• Tipo: Cão/Gato
• Raça: Raça do Animal
```

## 🔄 Atualização Automática

### **Opção 1: Atualização Manual**
- Acesse o Google My Maps
- Adicione novos casos conforme necessário
- O mapa será atualizado automaticamente no site

### **Opção 2: Integração com API (Avançado)**
- Use a Google Maps API para sincronização automática
- Requer configuração adicional e chave de API

## 🚀 Vantagens do Google My Maps

✅ **Fácil de usar** - Interface familiar do Google
✅ **Colaborativo** - Múltiplas pessoas podem editar
✅ **Compartilhável** - Link direto para o mapa
✅ **Mobile-friendly** - Funciona bem em dispositivos móveis
✅ **Integração** - Sincroniza com Google Drive
✅ **Offline** - Funciona sem internet (com cache)

## 🔧 Solução de Problemas

### **Mapa não aparece:**
- Verifique se o mapa está público
- Confirme se o ID está correto
- Teste o link de compartilhamento

### **Marcadores não aparecem:**
- Verifique se os endereços estão corretos
- Confirme se as camadas estão configuradas
- Teste a pesquisa de endereços

### **Permissões:**
- Certifique-se de que o mapa está "Público na Web"
- Verifique as configurações de compartilhamento
- Teste em modo anônimo

## 📱 Uso Mobile

O Google My Maps funciona perfeitamente em dispositivos móveis:
- Interface responsiva
- Toque para zoom e navegação
- Marcadores clicáveis
- Integração com apps do Google Maps
