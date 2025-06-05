import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  status,
}) => {
  const sizeClasses: Record<AvatarSize, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusColors: Record<string, string> = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-cyan-100 text-cyan-800 ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${statusColors[status]}`}
          style={{
            width: size === 'xs' ? '0.5rem' : size === 'sm' ? '0.625rem' : '0.75rem',
            height: size === 'xs' ? '0.5rem' : size === 'sm' ? '0.625rem' : '0.75rem',
          }}
        />
      )}
    </div>
  );
};