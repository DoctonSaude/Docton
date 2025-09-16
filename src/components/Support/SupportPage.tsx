import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  HelpCircle, 
  Send,
  Book,
  FileText,
  ThumbsUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Video,
  Edit,
  Trash2,
  X,
  Save,
  Plus
} from 'lucide-react';

// --- Interfaces e Dados de Exemplo ---
interface Feedback { id: string; type: 'sugestao' | 'reclamacao'; subject: string; description: string; status: 'enviado' | 'em_analise' | 'resolvido'; createdAt: string; author?: string; }
interface FAQ { id: string; category: string; question: string; answer: string; }
interface KnowledgeArticle { id: string; title: string; category: string; type: 'tutorial' | 'guide' | 'video'; content: string; }
interface Ticket { id: string; subject: string; status: 'open' | 'in-progress' | 'resolved'; priority: 'low' | 'medium' | 'high'; user: string; lastUpdate: string; }

const mockUserFeedback: Feedback[] = [
    { id: 'fb1', type: 'sugestao', subject: 'Aplicativo para Smartwatch', description: 'Gostaria de sugerir a criação de um app para o relógio.', status: 'em_analise', createdAt: '2025-07-15' },
];
const mockAllFeedback: Feedback[] = [ ...mockUserFeedback ];
const mockFaqs: FAQ[] = [
    { id: '1', category: 'account', question: 'Como altero minha senha?', answer: 'Para alterar sua senha, acesse Configurações > Segurança > Alterar Senha.' },
];
const mockKnowledgeBase: KnowledgeArticle[] = [
    { id: '1', title: 'Como fazer seu primeiro agendamento', category: 'appointments', type: 'tutorial', content: 'Guia passo-a-passo...' },
];
const mockTickets: Ticket[] = [
    { id: 'TK-001', subject: 'Problema com pagamento', status: 'open', priority: 'high', user: 'paciente@docton.com', lastUpdate: '2025-07-18' },
    { id: 'TK-002', subject: 'Dúvida sobre plano premium', status: 'in-progress', priority: 'medium', user: 'parceiro@docton.com', lastUpdate: '2025-07-17' },
];

const EditModal = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-bold">{title}</h2><button onClick={onClose}><X/></button></div>
            <div className="p-6 space-y-4">{children}</div>
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onClose} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold">Salvar</button>
            </div>
        </div>
    </div>
);

const FaqFormModal = ({ faq, onClose, onSave }: { faq?: FAQ, onClose: () => void, onSave: (data: any) => void }) => {
    const [question, setQuestion] = useState(faq?.question || '');
    const [answer, setAnswer] = useState(faq?.answer || '');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
                <div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-bold">{faq ? 'Editar' : 'Adicionar'} FAQ</h2><button onClick={onClose}><X/></button></div>
                <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Pergunta</label><input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                    <div><label className="block text-sm font-medium mb-1">Resposta</label><textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={5} className="w-full p-2 border rounded-lg"></textarea></div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                    <button onClick={() => { onSave({ question, answer }); onClose(); }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-2"><Save size={16}/> Salvar</button>
                </div>
            </div>
        </div>
    );
};

const ArticleFormModal = ({ article, onClose, onSave }: { article?: KnowledgeArticle, onClose: () => void, onSave: (data: any) => void }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [content, setContent] = useState(article?.content || '');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
                <div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-bold">{article ? 'Editar' : 'Adicionar'} Artigo</h2><button onClick={onClose}><X/></button></div>
                <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Título</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                    <div><label className="block text-sm font-medium mb-1">Conteúdo</label><textarea value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full p-2 border rounded-lg"></textarea></div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                    <button onClick={() => { onSave({ title, content }); onClose(); }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-2"><Save size={16}/> Salvar</button>
                </div>
            </div>
        </div>
    );
};

export default function SupportPage({ userRole }: { userRole: 'patient' | 'partner' | 'admin' }) {
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'tickets' : 'faq');
  const [faqs, setFaqs] = useState(mockFaqs);
  const [knowledgeBase, setKnowledgeBase] = useState(mockKnowledgeBase);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(userRole === 'admin' ? mockAllFeedback : mockUserFeedback);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const getTabs = () => {
    const commonTabs = [ { id: 'faq', label: 'FAQ', icon: HelpCircle }, { id: 'knowledge', label: 'Base de Conhecimento', icon: Book }, { id: 'contact', label: 'Contato', icon: MessageCircle } ];
    if (userRole === 'admin') {
      return [ { id: 'tickets', label: 'Tickets de Suporte', icon: FileText }, { id: 'feedback', label: 'Sugestões e Reclamações', icon: MessageSquare }, ...commonTabs, ];
    }
    return [ ...commonTabs, { id: 'feedback', label: 'Sugestões e Reclamações', icon: MessageSquare }, ];
  };
  const tabs = getTabs();

  const handleSaveFaq = (data: any) => {
    const newFaq = { ...data, id: Date.now().toString(), category: 'new' };
    setFaqs(prev => [newFaq, ...prev]);
  };
  const handleSaveArticle = (data: any) => {
    const newArticle = { ...data, id: Date.now().toString(), category: 'new', type: 'guide' as 'guide' };
    setKnowledgeBase(prev => [newArticle, ...prev]);
  };

  const renderFaqTab = () => (
    <div>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Perguntas Frequentes</h2>{userRole === 'admin' && <button onClick={() => setShowFaqModal(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1"><Plus size={16}/> Adicionar FAQ</button>}</div>
        <div className="space-y-4">
        {faqs.map(faq => (
            <div key={faq.id} className="bg-white rounded-lg border">
                <button onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)} className="w-full p-4 text-left flex justify-between items-center"><span className="font-semibold">{faq.question}</span>{expandedFAQ === faq.id ? <ChevronUp /> : <ChevronDown />}</button>
                {expandedFAQ === faq.id && <div className="p-4 border-t"><p className="text-gray-600">{faq.answer}</p>{userRole === 'admin' && (<div className="mt-4 flex gap-4"><button onClick={() => setEditingItem({type: 'faq', data: faq})} className="text-sm font-semibold text-blue-600">Editar</button><button className="text-sm font-semibold text-red-600">Excluir</button></div>)}</div>}
            </div>
        ))}
        </div>
    </div>
  );
  
  const renderKnowledgeBaseTab = () => (
    <div>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Tutoriais e Guias</h2>{userRole === 'admin' && <button onClick={() => setShowArticleModal(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1"><Plus size={16}/> Adicionar Artigo</button>}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeBase.map(article => (
                <div key={article.id} className="bg-white p-4 rounded-lg border group relative">
                    {article.type === 'video' ? <Video className="w-6 h-6 text-red-500 mb-2"/> : <FileText className="w-6 h-6 text-blue-500 mb-2"/>}<h3 className="font-semibold">{article.title}</h3><p className="text-sm text-gray-600 mt-1">{article.content}</p>
                     {userRole === 'admin' && (<div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setEditingItem({type: 'article', data: article})} className="p-1 bg-white rounded-full shadow"><Edit size={14} className="text-blue-600"/></button><button className="p-1 bg-white rounded-full shadow"><Trash2 size={14} className="text-red-600"/></button></div>)}
                </div>
            ))}
        </div>
    </div>
  );

  const renderFeedbackTab = () => {
    if (userRole !== 'admin') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1"><h3 className="font-semibold text-lg mb-2">Enviar Nova Mensagem</h3><p className="text-sm text-gray-500 mb-4">Sua opinião é importante para nós.</p><form className="space-y-4"><select className="w-full p-2 border rounded-lg bg-white"><option>Sugestão</option><option>Reclamação</option></select><input type="text" placeholder="Assunto" className="w-full p-2 border rounded-lg"/><textarea placeholder="Descreva sua mensagem..." rows={5} className="w-full p-2 border rounded-lg"></textarea><button className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"><Send className="w-4 h-4"/> Enviar</button></form></div>
          <div className="md:col-span-2"><h3 className="font-semibold text-lg mb-4">Seu Histórico</h3><div className="space-y-3">{feedbackList.map(fb => (<div key={fb.id} className="bg-gray-50 p-4 rounded-lg border"><div className="flex justify-between items-center"><p className="font-semibold">{fb.subject}</p><span className={`px-2 py-1 text-xs rounded-full ${fb.status === 'resolvido' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{fb.status.replace('_', ' ')}</span></div><p className="text-sm text-gray-600 mt-2">{fb.description}</p></div>))}</div></div>
        </div>
      );
    }
    return (
      <div>
        <h3 className="font-semibold text-lg mb-4">Painel de Sugestões e Reclamações</h3>
        <div className="space-y-3">{feedbackList.map(fb => (<div key={fb.id} className="bg-gray-50 p-4 rounded-lg border"><div className="flex justify-between items-center"><div><p className="font-semibold">{fb.subject}</p><p className="text-xs text-gray-500">Enviado por: {fb.author}</p></div><button onClick={() => setEditingItem({type: 'feedback', data: fb})} className="font-semibold text-emerald-600 text-sm">Responder</button></div><p className="text-sm text-gray-600 mt-2">{fb.description}</p></div>))}</div>
      </div>
    );
  };
  
  const renderTicketsTab = () => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tickets de Suporte</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left font-medium text-gray-500">Assunto</th><th className="px-6 py-3 text-left font-medium text-gray-500">Usuário</th><th className="px-6 py-3 text-left font-medium text-gray-500">Status</th><th className="px-6 py-3 text-left font-medium text-gray-500">Ações</th></tr></thead><tbody className="divide-y">{mockTickets.map(ticket => (<tr key={ticket.id}><td className="px-6 py-4 font-semibold">{ticket.subject}</td><td className="px-6 py-4">{ticket.user}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${ticket.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{ticket.status}</span></td><td className="px-6 py-4"><button onClick={() => setEditingItem({type: 'ticket', data: ticket})} className="font-semibold text-emerald-600">Responder</button></td></tr>))}</tbody></table></div>
    </div>
  );
  
  const renderContactTab = () => (
      <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Canais de Atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border"><Mail className="mx-auto w-8 h-8 text-emerald-600 mb-2"/><p className="font-semibold">E-mail</p><p className="text-sm">suporte@docton.com</p></div>
              <div className="bg-white p-4 rounded-lg border"><Phone className="mx-auto w-8 h-8 text-emerald-600 mb-2"/><p className="font-semibold">Telefone</p><p className="text-sm">(11) 3000-0000</p></div>
              <div className="bg-white p-4 rounded-lg border"><MessageCircle className="mx-auto w-8 h-8 text-emerald-600 mb-2"/><p className="font-semibold">Chat ao Vivo</p><button className="text-sm text-emerald-600 font-semibold">Iniciar Chat</button></div>
          </div>
      </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white"><h1 className="text-2xl font-bold mb-2">Central de Suporte</h1><p className="text-emerald-100">Estamos aqui para ajudar você.</p></div>
        {userRole === 'admin' && <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><div className="bg-white p-4 rounded-lg border"><p className="text-sm text-gray-500">Tickets Abertos</p><p className="text-2xl font-bold">27</p></div><div className="bg-white p-4 rounded-lg border"><p className="text-sm text-gray-500">Resolvidos Hoje</p><p className="text-2xl font-bold">15</p></div></div>}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200"><nav className="flex space-x-8 px-6">{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><tab.icon className="w-4 h-4" /><span>{tab.label}</span></button>))}</nav></div>
          <div className="p-6">
            {activeTab === 'faq' && renderFaqTab()}
            {activeTab === 'knowledge' && renderKnowledgeBaseTab()}
            {activeTab === 'feedback' && renderFeedbackTab()}
            {activeTab === 'tickets' && userRole === 'admin' && renderTicketsTab()}
            {activeTab === 'contact' && renderContactTab()}
          </div>
        </div>
      </div>

      {showFaqModal && <FaqFormModal onClose={() => setShowFaqModal(false)} onSave={handleSaveFaq} />}
      {showArticleModal && <ArticleFormModal onClose={() => setShowArticleModal(false)} onSave={handleSaveArticle} />}
      {editingItem && (
        <EditModal title={`Responder ao Ticket #${editingItem.data.id}`} onClose={() => setEditingItem(null)} onSave={() => {alert('Salvo!'); setEditingItem(null)}}>
            <p className="font-semibold">Assunto: {editingItem.data.subject}</p>
            <textarea placeholder="Digite sua resposta aqui..." rows={6} className="w-full p-2 border rounded-lg"></textarea>
        </EditModal>
      )}
    </>
  );
}