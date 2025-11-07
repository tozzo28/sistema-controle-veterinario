import React from 'react';
import { X, MapPin, Calendar, User, Phone, Shield } from 'lucide-react';
import { RabiesVaccineRecord } from '../api';

interface VaccinationDetailsModalProps {
  record: RabiesVaccineRecord;
  onClose: () => void;
}

const VaccinationDetailsModal: React.FC<VaccinationDetailsModalProps> = ({ record, onClose }) => {
  const getTipoAnimalBadge = (tipo: string) => {
    const tipoConfig = {
      cao: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      gato: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };

    const tipoNames = {
      cao: 'Cão',
      gato: 'Gato',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoConfig[tipo as keyof typeof tipoConfig]}`}>
        {tipoNames[tipo as keyof typeof tipoNames]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
            Detalhes da Vacinação - {record.nomeAnimal}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 -m-2"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Informações do Animal */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
              Informações do Animal
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{record.nomeAnimal}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <div className="mt-1">{getTipoAnimalBadge(record.tipo)}</div>
              </div>
            </div>
          </section>

          {/* Informações do Tutor */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Informações do Tutor
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{record.nomeTutor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endereço
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{record.endereco || 'Não informado'}</p>
              </div>
            </div>
          </section>

          {/* Informações da Vacinação */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Informações da Vacinação
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data da Vacinação
                </label>
                <p className="text-sm text-gray-900 dark:text-white flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(record.dataVacinacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Local da Vacinação
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{record.localVacinacao}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lote da Vacina
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {record.loteVacina}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {record.dosePerdida ? (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Dose Perdida
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Vacinado
                    </span>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Localização */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-600" />
              Localização
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Área
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{record.area}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quadra
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{record.quadra}</p>
              </div>
              {record.latitude && record.longitude && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Latitude
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {typeof record.latitude === 'number' ? record.latitude.toFixed(6) : parseFloat(String(record.latitude)).toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Longitude
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {typeof record.longitude === 'number' ? record.longitude.toFixed(6) : parseFloat(String(record.longitude)).toFixed(6)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        <div className="flex justify-end p-3 sm:p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-3 sm:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-base sm:text-sm font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaccinationDetailsModal;

