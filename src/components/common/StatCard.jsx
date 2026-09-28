import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  iconColor = 'text-navy-600 bg-navy-50',
  className = ''
}) {
  const renderTrend = () => {
    if (!trend) return null;
    
    let TrendIcon = Minus;
    let colorClass = 'text-gray-500';
    
    if (trend === 'up') {
      TrendIcon = TrendingUp;
      colorClass = 'text-green-600';
    } else if (trend === 'down') {
      TrendIcon = TrendingDown;
      colorClass = 'text-red-600';
    }

    return (
      <div className={`flex items-center text-sm font-medium ${colorClass}`}>
        <TrendIcon size={16} className="mr-1" aria-hidden="true" />
        <span>{trendValue}</span>
      </div>
    );
  };

  return (
    <Card className={className} padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconColor}`} aria-hidden="true">
            <Icon size={24} />
          </div>
        )}
      </div>
      {(trend || subtitle) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {renderTrend()}
          {subtitle && (
            <span className="text-gray-500">{subtitle}</span>
          )}
        </div>
      )}
    </Card>
  );
}
