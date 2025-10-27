import React from 'react';
import { Target, CheckCircle, AlertTriangle } from 'lucide-react';

interface PrecisionIndicatorProps {
  confidence?: number;
  source?: string;
  isManual?: boolean;
}

const PrecisionIndicator: React.FC<PrecisionIndicatorProps> = ({ 
  confidence = 0, 
  source = 'Desconhecido',
  isManual = false 
}) => {
  const getIndicator = () => {
    if (isManual || confidence === 1.0) {
      return {
        icon: <Target className="w-4 h-4" />,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        label: '🎯 100% PRECISO',
        description: 'Coordenadas manuais exatas'
      };
    } else if (confidence >= 0.8) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        label: '✅ ALTA PRECISÃO',
        description: `${Math.round(confidence * 100)}% de confiança`
      };
    } else if (confidence >= 0.5) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        label: '⚠️ PRECISÃO MÉDIA',
        description: `${Math.round(confidence * 100)}% de confiança`
      };
    } else {
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        label: '📍 APROXIMADO',
        description: `${Math.round(confidence * 100)}% de confiança`
      };
    }
  };

  const indicator = getIndicator();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${indicator.bgColor} ${indicator.borderColor}`}>
      <div className={indicator.color}>
        {indicator.icon}
      </div>
      <div className="text-xs">
        <span className={`font-semibold ${indicator.color}`}>
          {indicator.label}
        </span>
        <div className={`text-xs ${indicator.color.replace('600', '500').replace('400', '300')} mt-0.5`}>
          {indicator.description}
        </div>
        {source && (
          <div className={`text-xs ${indicator.color.replace('600', '400').replace('400', '300')} mt-0.5`}>
            Fonte: {source}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrecisionIndicator;
