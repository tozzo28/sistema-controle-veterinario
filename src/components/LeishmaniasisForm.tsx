import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LeishmaniasisFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const LeishmaniasisForm: React.FC<LeishmaniasisFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Dados do animal
    nomeAnimal: '',
    tipoAnimal: 'cao', // Novo campo para tipo de animal
    idade: '',
    raca: '',
    sexo: '',
    pelagem: '',
    corPelagem: '',
    
    // Dados do tutor
    nomeTutor: '',
    cpf: '',
    telefone: '',
    endereco: '',
    
    // Georreferenciamento
    quadra: '',
    area: '',
    
    // Status
    status: 'notificado',
  });

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
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">Cadastrar Novo Caso - Leishmaniose</h3>
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
                  Endereço
                </label>
                <textarea
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 sm:py-2 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Georreferenciamento */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Georreferenciamento</h4>
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
              Salvar Caso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeishmaniasisForm;