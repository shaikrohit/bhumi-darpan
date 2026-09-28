import React from 'react';
import Breadcrumb from './Breadcrumb';

export default function PageHeader({ title, subtitle, icon: Icon, actions, breadcrumbs, className = '' }) {
  return (
    <header className={`mb-6 md:mb-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          {Icon && (
            <div className="mr-3 p-2 bg-navy-50 rounded-lg">
              <Icon className="w-6 h-6 text-navy-700" aria-hidden="true" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {actions && (
          <div className="flex flex-col sm:flex-row gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
