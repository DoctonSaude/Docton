import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  header,
  onClick,
  hoverable = false,
}) => {
  const cardClasses = [
    'bg-white rounded-xl shadow-sm overflow-hidden',
    hoverable ? 'transition-transform duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer' : '',
    onClick ? 'cursor-pointer' : '',
    className
  ].join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {header && <div className="px-6 py-4 border-b border-gray-100">{header}</div>}
      
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className="px-6 py-4">{children}</div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">{footer}</div>
      )}
    </div>
  );
};