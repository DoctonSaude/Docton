import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rounded?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  rounded = false,
}) => {
  const variantClasses = {
    primary: 'bg-cyan-100 text-cyan-800',
    secondary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-gray-100 text-gray-800',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses} ${className}`}
    >
      {children}
    </span>
  );
};