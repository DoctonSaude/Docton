import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function FormationStatus() {
  // Dados de exemplo. No futuro, eles podem vir de props ou de um hook.
  const progress = 76;
  const statusText = "In progress";
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Formation status</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold">
          View details
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        {/* Gráfico Circular de Progresso com SVG */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            {/* Círculo de fundo (trilha) */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              strokeWidth="12"
              className="stroke-gray-200"
              fill="transparent"
            />
            {/* Círculo de progresso */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              strokeWidth="12"
              className="stroke-indigo-600"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            {/* Texto no centro */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              className="text-3xl font-bold fill-gray-800"
            >
              {progress}%
            </text>
          </svg>
        </div>
        
        {/* Status em texto */}
        <div className="mt-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="font-semibold text-gray-700">{statusText}</span>
        </div>
      </div>
    </div>
  );
}