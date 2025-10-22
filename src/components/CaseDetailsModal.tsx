import React from 'react';
import { X, MapPin, Calendar, User, Phone, Mail } from 'lucide-react';

interface LeishmaniasisCase {
  id: number;
  nomeAnimal: string;
  tipoAnimal: string;
  idade?: string;
  raca?: string;
  sexo?: string;
  pelagem?: string;
  corPelagem?: string;
  nomeTutor: string;
  status: string;
  area: string;
  quadra: string;
  dataNotificacao: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
}

interface CaseDetailsModalProps {
  case_: LeishmaniasisCase;
  onClose: () => void;
}

const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({ case_, onClose }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      notificado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      positivo: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      negativo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      eutanasiado: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      tratamento: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      recusa_eutanasia: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      recusa_tratamento: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };

    const statusNames = {
      notificado: 'Notificado',
      positivo: 'Positivo',
      negativo: 'Negativo',
      eutanasiado: 'Eutanasiado',
      tratamento: 'Em Tratamento',
      recusa_eutanasia: 'Recusa Eutanásia',
      recusa_tratamento: 'Recusa Tratamento',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {statusNames[status as keyof typeof statusNames]}
      </span>
    );
  };

  const getTipoAnimalBadge = (tipo: string) => {
    const tipoConfig = {
      cao: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      gato: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      outro: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    const tipoNames = {
      cao: 'Cão',
      gato: 'Gato',
      outro: 'Outro',
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
            Detalhes do Caso - {case_.nomeAnimal}
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
                <p className="text-sm text-gray-900 dark:text-white">{case_.nomeAnimal}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <div className="mt-1">{getTipoAnimalBadge(case_.tipoAnimal)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Idade
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{case_.idade || 'Não informado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Raça
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{case_.raca || 'Não informado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sexo
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{case_.sexo || 'Não informado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pelagem
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{case_.pelagem || 'Não informado'}</p>
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
                <p className="text-sm text-gray-900 dark:text-white">{case_.nomeTutor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CPF
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{case_.cpf || 'Não informado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefone
                </label>
                <p className="text-sm text-gray-900 dark:text-white flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {case_.telefone || 'Não informado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endereço
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{case_.endereco || 'Não informado'}</p>
              </div>
            </div>
          </section>

          {/* Status e Localização */}
          <section>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-600" />
              Status e Localização
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(case_.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Localização
                </label>
                <p className="text-sm text-gray-900 dark:text-white">Área {case_.area} - Quadra {case_.quadra}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de Notificação
                </label>
                <p className="text-sm text-gray-900 dark:text-white flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(case_.dataNotificacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
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

export default CaseDetailsModal;
