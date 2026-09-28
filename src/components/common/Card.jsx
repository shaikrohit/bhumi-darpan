import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
  padding = 'md'
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hasHeader = title || subtitle || Icon || action;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {hasHeader && (
        <div className={`flex items-start justify-between border-b border-gray-100 ${paddings[padding] || paddings.md} pb-4`}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="text-gray-500 flex-shrink-0" aria-hidden="true">
                <Icon size={24} />
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
          </div>
          {action && (
            <div className="flex-shrink-0 ml-4">
              {action}
            </div>
          )}
        </div>
      )}
      <div className={paddings[padding] || paddings.md}>
        {children}
      </div>
    </div>
  );
}
