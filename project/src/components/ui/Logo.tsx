import React from 'react';
import { Stethoscope } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const iconSizes = {
    small: 20,
    medium: 24,
    large: 36
  };

  return (
    <div className="flex items-center">
      <Stethoscope 
        size={iconSizes[size]} 
        className="text-cyan-600 mr-2" 
        strokeWidth={2} 
      />
      <span className={`font-bold ${sizeClasses[size]} text-gray-900`}>
        Doc<span className="text-cyan-600">ton</span>
      </span>
    </div>
  );
};