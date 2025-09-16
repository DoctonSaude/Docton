import React, { useState } from 'react';
import { 
  Share2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Key,
  Plus,
  Trash2,
  Copy,
  Webhook,
  X,
  Save
} from 'lucide-react';

// --- Interfaces e Dados de Exemplo ---
interface Integration { id: string; name: string; description: string; status: 'connected' | 'disconnected' | 'error'; }
interface ApiKey { id: string; name: string; key: string; keyPreview: string; createdAt: string; lastUsed: string; }
interface WebhookEndpoint { id: string; url: string; events: string[]; }

const mockIntegrations: Integration[] = [
    { id: 'gfit', name: 'Google Fit', description: 'Sincronização de dados de atividade física.', status: 'connected' },
    { id: 'ahealth', name: 'Apple Health', description: 'Sincronização de dados de saúde do iOS.', status: 'connected' },
    { id: 'payment', name: 'Gateway de Pagamento', description: 'Processamento de transações com cartão e Pix.', status: 'connected' },
    { id: 'scheduling', name: 'Apps de Agendamento', description: 'Sincronização com calendários externos.', status: 'disconnected' },
];
const mockApiKeys: ApiKey[] = [
    { id: '1', name: 'API App Mobile Docton', key: 'sk_live_1234567890abcdefghijklmnopqrstuv', keyPreview: 'sk_live_...aBc1', createdAt: '15/01/2025', lastUsed: 'Hoje' },
    { id: '2', name: 'API Parceiro TechHealth', key: 'sk_live_zyxwutsrqponmlkjihgfedcba0987654321', keyPreview: 'sk_live_...xYz9', createdAt: '22/03/2025', lastUsed: 'Ontem' },
];
const mockWebhooks: WebhookEndpoint[] = [
    { id: 'wh1', url: 'https://api.parceiro.com/webhooks/docton', events: ['pagamento.aprovado', 'desafio.concluido'] }
];

// --- Componentes de Modal ---
const ApiKeyFormModal = ({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) => {
    const [name, setName] = useState('');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
                <div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-bold">Gerar Nova Chave de API</h2><button onClick={onClose}><X/></button></div>
                <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Nome da Chave</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: API App Parceiro" className="w-full p-2 border rounded-lg"/></div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                    <button onClick={() => { onSave({ name }); onClose(); }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-2"><Save size={16}/> Gerar Chave</button>
                </div>
            </div>
        </div>
    );
};

const WebhookFormModal = ({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) => {
    const [url, setUrl] = useState('');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
                <div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-bold">Adicionar Webhook</h2><button onClick={onClose}><X/></button></div>
                <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium mb-1">URL do Endpoint</label><input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.seu-servico.com/webhook" className="w-full p-2 border rounded-lg"/></div>
                    <div><label className="block text-sm font-medium mb-1">Eventos a serem enviados</label><p className="text-xs text-gray-500">(Funcionalidade de seleção de eventos a ser implementada)</p></div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                    <button onClick={() => { onSave({ url, events: [] }); onClose(); }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-2"><Save size={16}/> Adicionar</button>
                </div>
            </div>
        </div>
    );
};

const RevokeKeyModal = ({ apiKey, onConfirm, onCancel }: { apiKey: ApiKey, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Revogar Chave de API</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja revogar permanentemente a chave "{apiKey.name}"? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Revogar</button>
            </div>
        </div>
    </div>
);

export default function AdminApiIntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [revokingKey, setRevokingKey] = useState<ApiKey | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  const getStatusInfo = (status: 'connected' | 'disconnected' | 'error') => { /* ... */ };
  const copyToClipboard = (text: string) => { /* ... */ };

  const handleSaveApiKey = (data: any) => {
      const newKey = `sk_live_${Math.random().toString(36).substring(2)}`;
      const newApiKey: ApiKey = {
          id: Date.now().toString(),
          name: data.name,
          key: newKey,
          keyPreview: `${newKey.substring(0, 10)}...${newKey.slice(-4)}`,
          createdAt: new Date().toLocaleDateString('pt-BR'),
          lastUsed: 'Nunca'
      };
      setApiKeys(prev => [newApiKey, ...prev]);
      alert(`Chave gerada com sucesso! Copie e guarde em um local seguro:\n\n${newKey}`);
  };

  const handleSaveWebhook = (data: any) => {
      const newWebhook: WebhookEndpoint = {
          id: Date.now().toString(),
          url: data.url,
          events: ['pagamento.aprovado', 'desafio.concluido'] // Exemplo
      };
      setWebhooks(prev => [...prev, newWebhook]);
  };
  
  const handleRevokeKey = () => {
      if (!revokingKey) return;
      setApiKeys(prev => prev.filter(key => key.id !== revokingKey.id));
      setRevokingKey(null);
  };

  return (
    <>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">APIs e Integrações</h1>
          <p className="text-gray-500">Gerencie as conexões da plataforma com serviços externos.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">{/* ... Status das Integrações ... */}</div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Chaves de API Públicas</h2>
              <button onClick={() => setShowApiKeyModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm"><Plus size={16} /> Gerar Nova Chave</button>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm">{/* ... Tabela de Chaves de API ... */}</table>
          </div>
        </div>
        
         <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Webhook/> Webhooks</h2>
              <button onClick={() => setShowWebhookModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm"><Plus size={16} /> Adicionar Webhook</button>
          </div>
          <div className="space-y-2 mt-4">
              {webhooks.map(wh => (
                  <div key={wh.id} className="p-3 border rounded-lg flex justify-between items-center">
                      <p className="font-mono text-sm text-gray-700">{wh.url}</p>
                      <button onClick={() => setWebhooks(prev => prev.filter(w => w.id !== wh.id))} title="Excluir Webhook" className="text-red-500"><Trash2 size={16}/></button>
                  </div>
              ))}
          </div>
        </div>
      </div>

      {revokingKey && (<RevokeKeyModal apiKey={revokingKey} onCancel={() => setRevokingKey(null)} onConfirm={handleRevokeKey} />)}
      {showApiKeyModal && <ApiKeyFormModal onClose={() => setShowApiKeyModal(false)} onSave={handleSaveApiKey} />}
      {showWebhookModal && <WebhookFormModal onClose={() => setShowWebhookModal(false)} onSave={handleSaveWebhook} />}
    </>
  );
}