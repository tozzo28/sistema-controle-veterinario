import React, { useState } from 'react';
import { createRabies } from '../api';
import { X } from 'lucide-react';

interface RabiesVaccineFormProps {
  onClose: () => void;
}

const RabiesVaccineForm: React.FC<RabiesVaccineFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    // Dados do animal
    nomeAnimal: '',
    tipo: 'cao',
    idade: '',
    raca: '',
    sexo: '',
    
    // Dados do tutor
    nomeTutor: '',
    cpf: '',
    telefone: '',
    endereco: '',
    
    // Dados da vacinação
    dataVacinacao: '',
    localVacinacao: '',
    loteVacina: '',
    veterinario: '',
    clinica: '',
    dosePerdida: false,
    
    // Georreferenciamento
    quadra: '',
    area: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nomeAnimal: formData.nomeAnimal,
        tipo: formData.tipo as 'cao' | 'gato',
        nomeTutor: formData.nomeTutor,
        dataVacinacao: formData.dataVacinacao || new Date().toISOString(),
        localVacinacao: formData.localVacinacao,
        area: formData.area,
        quadra: formData.quadra,
        loteVacina: formData.loteVacina,
        dosePerdida: !!formData.dosePerdida,
      };
      await createRabies(payload);
      onClose();
    } catch (err) {
      alert('Falha ao registrar vacinação');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Registrar Nova Vacinação</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Dados do Animal */}
          <section>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Dados do Animal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  name="nomeAnimal"
                  value={formData.nomeAnimal}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="cao">Cão</option>
                  <option value="gato">Gato</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <input
                  type="text"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                <input
                  type="text"
                  name="raca"
                  value={formData.raca}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
              </div>
            </div>
          </section>

          {/* Dados do Tutor */}
          <section>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Dados do Tutor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  name="nomeTutor"
                  value={formData.nomeTutor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo *</label>
                <textarea
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ex: Rua das Flores, 123, Centro, Paraguaçu Paulista - SP"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Inclua rua, número, bairro e cidade para localização precisa no mapa
                </p>
              </div>
            </div>
          </section>

          {/* Dados da Vacinação */}
          <section>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Dados da Vacinação</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data da Vacinação</label>
                <input
                  type="date"
                  name="dataVacinacao"
                  value={formData.dataVacinacao}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local da Vacinação</label>
                <input
                  type="text"
                  name="localVacinacao"
                  value={formData.localVacinacao}
                  onChange={handleChange}
                  placeholder="Ex: Centro Veterinário Municipal, Clínica Pet Care..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lote da Vacina</label>
                <input
                  type="text"
                  name="loteVacina"
                  value={formData.loteVacina}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Veterinário Responsável</label>
                <input
                  type="text"
                  name="veterinario"
                  value={formData.veterinario}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clínica/Instituição</label>
                <input
                  type="text"
                  name="clinica"
                  value={formData.clinica}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div className="flex items-center mt-2">
                <input
                  id="dosePerdida"
                  type="checkbox"
                  checked={formData.dosePerdida}
                  onChange={(e) => setFormData({ ...formData, dosePerdida: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="dosePerdida" className="ml-2 block text-sm text-gray-700">
                  Dose perdida
                </label>
              </div>
            </div>
          </section>

          {/* Georreferenciamento */}
          <section>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Georreferenciamento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quadra</label>
                <input
                  type="text"
                  name="quadra"
                  value={formData.quadra}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Ex: Centro, Norte, Sul, Leste, Oeste..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Registrar Vacinação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RabiesVaccineForm;