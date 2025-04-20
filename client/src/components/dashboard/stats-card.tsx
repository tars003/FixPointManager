import { ArrowUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  description,
  change,
  chart,
  iconBgClass = 'bg-primary-light',
  iconColorClass = 'text-primary'
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`${iconBgClass} p-1.5 rounded-full`}>
          <div className={`h-5 w-5 ${iconColorClass}`}>
            {icon}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <h4 className="text-3xl font-bold">{value}</h4>
          {description && (
            <p className="text-sm text-neutral-light">{description}</p>
          )}
        </div>
        
        {(change || chart) && (
          <div className="flex-1">
            {change && (
              <div className="flex items-center mt-1">
                <span className={`mr-1 flex items-center text-sm ${
                  change.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  <ArrowUp 
                    className={`h-4 w-4 ${!change.isPositive && 'rotate-180'}`}
                  />
                  {change.value}%
                </span>
                <span className="text-sm text-neutral-light">vs last month</span>
              </div>
            )}
            
            {chart}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
