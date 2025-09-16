import React, { useState } from 'react';
import { CheckCircle, Star } from 'lucide-react';

// 1. A PÁGINA AGORA ESPERA RECEBER A FUNÇÃO onSubscribe
interface SubscriptionPageProps {
  onSubscribe: (plan: any) => void;
  currentPlanName: string;
}

export default function SubscriptionPage({ onSubscribe, currentPlanName }: SubscriptionPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'plan_free',
      name: 'Grátis',
      price: { monthly: 0, yearly: 0 },
      description: 'Comece a usar a Docton com os recursos essenciais.',
      features: [
        'Acesso à rede de parceiros',
        'Busca e comparação de preços',
        'Até 10% de desconto em serviços',
        'Prontuário digital simplificado'
      ],
      isFeatured: false,
    },
    {
      id: 'plan_basic',
      name: 'Básico',
      price: { monthly: 19.99, yearly: 199.90 },
      description: 'Ideal para quem busca mais economia e recursos inteligentes.',
      features: [
        'Todos os benefícios do Grátis',
        'Descontos de até 30% em serviços',
        'Relatórios de saúde com IA',
        'Acesso a desafios gamificados',
        'Suporte prioritário'
      ],
      isFeatured: true,
    },
    {
      id: 'plan_premium',
      name: 'Premium',
      price: { monthly: 299.99, yearly: 2999.90 },
      description: 'A experiência de saúde mais completa e exclusiva.',
      features: [
        'Todos os benefícios do Básico',
        'Descontos de até 50% em serviços',
        'Check-ups anuais inclusos',
        'Acesso à Casa Docton',
        'Atendimento VIP e concierge'
      ],
      isFeatured: false,
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Planos flexíveis para suas necessidades</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Escolha o plano ideal e tenha acesso a descontos exclusivos e ferramentas para cuidar da sua saúde.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => {
            const isCurrent = plan.name === currentPlanName;
            return (
              <div 
                key={plan.name} 
                className={`bg-white rounded-2xl shadow-lg p-8 border-2 relative ${plan.isFeatured && !isCurrent ? 'border-emerald-500' : 'border-transparent'}`}
              >
                {isCurrent && (
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">SEU PLANO ATUAL</div>
                )}
                {plan.isFeatured && !isCurrent && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">MAIS POPULAR</div>
                )}
                <h2 className="text-2xl font-bold text-center text-gray-800">{plan.name}</h2>
                <p className="text-center text-gray-500 mt-2 h-10">{plan.description}</p>
                
                <div className="text-center my-8">
                  <span className="text-5xl font-extrabold text-gray-900">
                    R$ {plan.price.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-gray-500">/mês</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* 2. O BOTÃO AGORA CHAMA A FUNÇÃO onSubscribe */}
                <button 
                  onClick={() => onSubscribe(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                      isCurrent ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                      plan.isFeatured ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {isCurrent ? 'Plano Ativo' : plan.name === 'Grátis' ? 'Continuar com o Grátis' : `Fazer Upgrade`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
