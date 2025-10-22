import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    green: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    yellow: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    red: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    purple: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${colorClasses[color]} flex-shrink-0 self-start sm:self-center`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;