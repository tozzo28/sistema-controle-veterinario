import React, { useState } from 'react';
import { X, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { geocodeAddress } from '../services/geocoding';
import InteractiveFormMap from './InteractiveFormMap';

interface LeishmaniasisFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const LeishmaniasisForm: React.FC<LeishmaniasisFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    // Dados do animal
    nomeAnimal: initialData?.nomeAnimal || '',
    tipoAnimal: initialData?.tipoAnimal || 'cao',
    idade: initialData?.idade || '',
    raca: initialData?.raca || '',
    sexo: initialData?.sexo || '',
    pelagem: initialData?.pelagem || '',
    corPelagem: initialData?.corPelagem || '',
    
    // Dados do tutor
    nomeTutor: initialData?.nomeTutor || '',
    cpf: initialData?.cpf || '',
    telefone: initialData?.telefone || '',
    endereco: initialData?.endereco || '',
    
    // Georreferenciamento
    quadra: initialData?.quadra || '',
    area: initialData?.area || '',
    
    // Status
    status: initialData?.status || 'notificado',
    
    // Coordenadas Manuais
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
  });

  // Estado para geocodificação em tempo real
  const [geocodingState, setGeocodingState] = useState({
    isLoading: false,
    result: null as any,
    error: null as string | null,
    tested: false
  });

  // Função para lidar com mudanças de coordenadas do mapa
  const handleMapCoordinatesChange = (lat: number, lng: number, address: string, isManual: boolean) => {
    console.log('🗺️ [FORMULÁRIO] Coordenadas atualizadas pelo mapa:', { lat, lng, address, isManual });
    
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    // Se foi posição manual, atualizar o estado de geocodificação
    if (isManual) {
      setGeocodingState({
        isLoading: false,
        result: {
          lat,
          lng,
          address,
          success: true,
          source: 'Posição Manual no Mapa',
          confidence: 1.0
        },
        error: null,
        tested: true
      });
    }
  };

  // Função para testar geocodificação
  const testGeocode = async () => {
    if (!formData.endereco.trim()) {
      alert('Por favor, digite um endereço primeiro.');
      return;
    }

    setGeocodingState({ isLoading: true, result: null, error: null, tested: false });

    try {
      const result = await geocodeAddress(formData.endereco);
      
      if (result.success) {
        setGeocodingState({
          isLoading: false,
          result: result,
          error: null,
          tested: true
        });

        // Auto-preencher coordenadas se encontradas
        if (result.lat && result.lng) {
          setFormData(prev => ({
            ...prev,
            latitude: result.lat,
            longitude: result.lng
          }));
        }
      } else {
        setGeocodingState({
          isLoading: false,
          result: null,
          error: result.error || 'Endereço não encontrado',
          tested: true
        });
      }
    } catch (error) {
      setGeocodingState({
        isLoading: false,
        result: null,
        error: `Erro: ${error}`,
        tested: true
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nomeAnimal || !formData.nomeTutor || !formData.area || !formData.quadra) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Envia os dados para o componente pai
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Editar Caso - Leishmaniose' : 'Cadastrar Novo Caso - Leishmaniose'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 -m-2"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Dados do Animal */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Dados do Animal</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Animal *
                </label>
                <input
                  type="text"
                  name="nomeAnimal"
                  value={formData.nomeAnimal}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Animal *
                </label>
                <select
                  name="tipoAnimal"
                  value={formData.tipoAnimal}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="cao">Cão</option>
                  <option value="gato">Gato</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Idade
                </label>
                <input
                  type="text"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  placeholder="Ex: 3 anos"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Raça
                </label>
                <input
                  type="text"
                  name="raca"
                  value={formData.raca}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Selecione</option>
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pelagem
                </label>
                <input
                  type="text"
                  name="pelagem"
                  value={formData.pelagem}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cor da Pelagem
                </label>
                <input
                  type="text"
                  name="corPelagem"
                  value={formData.corPelagem}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Dados do Tutor */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Dados do Tutor</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Tutor *
                </label>
                <input
                  type="text"
                  name="nomeTutor"
                  value={formData.nomeTutor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endereço Completo *
                </label>
                <div className="space-y-2">
                  <textarea
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Ex: Rua das Flores, 123, Centro, Paraguaçu Paulista - SP"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                  
                  {/* Botão de Teste de Geocodificação */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={testGeocode}
                      disabled={geocodingState.isLoading || !formData.endereco.trim()}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {geocodingState.isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      <span>
                        {geocodingState.isLoading ? 'Testando...' : 'Testar Localização'}
                      </span>
                    </button>
                    
                    {/* Status da Geocodificação */}
                    {geocodingState.tested && (
                      <div className="flex items-center space-x-1">
                        {geocodingState.result ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 dark:text-green-400">
                              Encontrado!
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600 dark:text-red-400">
                              Não encontrado
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Resultado da Geocodificação */}
                  {geocodingState.result && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Localização Encontrada
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                            <strong>Endereço:</strong> {geocodingState.result.address}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            <strong>Coordenadas:</strong> {geocodingState.result.lat.toFixed(6)}, {geocodingState.result.lng.toFixed(6)}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            <strong>Fonte:</strong> {geocodingState.result.source}
                          </p>
                          {geocodingState.result.confidence && (
                            <p className="text-xs text-green-700 dark:text-green-300">
                              <strong>Confiança:</strong> {Math.round(geocodingState.result.confidence * 100)}%
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Erro da Geocodificação */}
                  {geocodingState.error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            Localização Não Encontrada
                          </p>
                          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                            {geocodingState.error}
                          </p>
                          
                          {/* Dicas Específicas */}
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-red-700 dark:text-red-300">
                              💡 Dicas para melhorar a localização:
                            </p>
                            <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 ml-4">
                              <li>• Inclua o bairro correto (Vila Nova, Centro, Vila Galdino, etc.)</li>
                              <li>• Adicione o número da casa/estabelecimento</li>
                              <li>• Use nomes de ruas conhecidas (Av. Brasil, Av. Siqueira Campos, etc.)</li>
                              <li>• O CEP 19700-000 é válido para Paraguaçu Paulista</li>
                              <li>• Exemplos que funcionam:</li>
                            </ul>
                            <div className="bg-red-100 dark:bg-red-800/30 p-2 rounded text-xs text-red-700 dark:text-red-300 mt-2">
                              <p>✅ "Av. Brasil, 951 - Centro, Paraguaçu Paulista - SP"</p>
                              <p>✅ "Av. Siqueira Campos, 2537 - Vila Nova, Paraguaçu Paulista - SP"</p>
                              <p>✅ "Av. Galdino, 1100 - Vila Galdino, Paraguaçu Paulista - SP"</p>
                              <p>✅ "Rua das Flores, 123 - Centro, Paraguaçu Paulista - SP, 19700-000"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  💡 Inclua rua, número, bairro e cidade para localização precisa no mapa
                </p>
                
                {/* Mapa Interativo */}
                {formData.endereco && formData.endereco.trim().length > 10 && (
                  <div className="mt-4">
                    <InteractiveFormMap
                      address={formData.endereco}
                      onCoordinatesChange={handleMapCoordinatesChange}
                      initialLat={formData.latitude as number}
                      initialLng={formData.longitude as number}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Georreferenciamento */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Georreferenciamento</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              📍 Área e quadra são usadas como fallback se o endereço não for encontrado
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Área *
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Ex: 1, 2, 3..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quadra *
                </label>
                <input
                  type="text"
                  name="quadra"
                  value={formData.quadra}
                  onChange={handleChange}
                  placeholder="Ex: A-15, B-23..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </section>


          {/* Status */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Status do Caso</h4>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full sm:w-1/2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="notificado">Notificado</option>
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
              <option value="eutanasiado">Eutanasiado</option>
              <option value="tratamento">Em Tratamento</option>
              <option value="recusa_eutanasia">Recusa Eutanásia</option>
              <option value="recusa_tratamento">Recusa Tratamento</option>
            </select>
          </section>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base sm:text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-base sm:text-sm font-medium"
            >
{initialData ? 'Atualizar Caso' : 'Salvar Caso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeishmaniasisForm;