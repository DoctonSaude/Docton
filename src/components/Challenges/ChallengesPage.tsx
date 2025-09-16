import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Star, 
  Clock, 
  Users, 
  Search, 
  Bookmark,
  Zap,
  Heart,
  Brain,
  X, 
  Send, 
  UserCheck,
  Target,
  CheckCircle,
  Gift
} from 'lucide-react';

// Importamos o modal que vamos usar
import RedeemRewardModal from '../Pages/RedeemRewardModal';

// --- Interfaces e Dados de Exemplo ---
interface FeaturedChallenge { id: string; title: string; description: string; duration: number; points: number; icon: React.ElementType; }
interface Challenge {
  id: string;
  title: string;
  description: string;
  tags: { label: string, color: string }[];
  remainingTime: string;
  status: 'Pendente' | 'Em Andamento';
  points: number;
  progress: number;
  progressGoal: number;

  progressUnit: string;
  icon: React.ElementType;
  isParticipating: boolean;
}
interface CommunityPost { id: number; author: string; message: string; time: string; avatar: string; }
interface Reward { id: string; title: string; cost: number; image: string; }

const mockFeatured: FeaturedChallenge[] = [
    { id: 'f1', title: 'Caminhada 30 Minutos', description: 'Caminhe 30 minutos por dia, por 30 dias', duration: 30, points: 600, icon: Heart },
    { id: 'f2', title: 'Meditação Guiada', description: '5 minutos de meditação por dia, durante 7 dias', duration: 7, points: 300, icon: Brain },
    { id: 'f3', title: '5 Frutas e Verduras', description: 'Consuma 5 porções de frutas e verduras diariamente', duration: 15, points: 500, icon: Zap },
    { id: 'f4', title: 'Indique um Amigo', description: 'Convide amigos e experimente a plataforma juntos', duration: 0, points: 1000, icon: UserCheck },
];

const initialChallenges: Challenge[] = [
    { id: 'c1', title: 'Hidratação Diária', description: 'Beba 2 litros de água por dia', tags: [{label: 'Fácil', color: 'bg-green-100 text-green-700'}, {label: 'Diário', color: 'bg-orange-100 text-orange-700'}], remainingTime: '3 dias restantes', status: 'Pendente', points: 50, progress: 0, progressGoal: 2000, progressUnit: 'ml' , icon: Zap, isParticipating: false},
    { id: 'c2', title: 'Passos Semanais', description: 'Complete 50.000 passos esta semana', tags: [{label: 'Semanal', color: 'bg-blue-100 text-blue-700'}, {label: 'Médio', color: 'bg-yellow-100 text-yellow-700'}], remainingTime: '3 dias restantes', status: 'Em Andamento', points: 200, progress: 32500, progressGoal: 50000, progressUnit: 'passos', icon: Target, isParticipating: true },
    { id: 'c3', title: 'Check-up Completo', description: 'Realize todos os exames anuais recomendados', tags: [{label: 'Mensal', color: 'bg-purple-100 text-purple-700'}, {label: 'Difícil', color: 'bg-red-100 text-red-700'}], remainingTime: '22 dias restantes', status: 'Pendente', points: 500, progress: 0, progressGoal: 6, progressUnit: 'exames', icon: CheckCircle, isParticipating: false },
];

const mockRewards: Reward[] = [
    { id: 'r1', title: '+10% de desconto em consulta', cost: 300, image: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 'r2', title: 'Ebook de Receitas Saudáveis', cost: 250, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 'r3', title: 'Sessão de Terapia Online', cost: 1000, image: 'https://images.pexels.com/photos/4989169/pexels-photo-4989169.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const mockRanking = [ { rank: 1, name: 'Juliana S.', progress: 100, isCurrentUser: false }, { rank: 47, name: 'Você', progress: 80, isCurrentUser: true } ];
const initialCommunity: CommunityPost[] = [ { id: 1, author: 'Juliana S.', message: 'Reta final! Alguém tem dicas para os últimos dias?', time: '2h atrás', avatar: 'https://i.pravatar.cc/40?img=1' } ];
// ------------------------------------

// --- Componente do Modal de Detalhes do Desafio ---
const ChallengeDetailModal = ({ challenge, onClose, onUpdateProgress, onPostMessage, communityPosts }: { challenge: Challenge, onClose: () => void, onUpdateProgress: (challengeId: string, newProgress: number) => void, onPostMessage: (message: string) => void, communityPosts: CommunityPost[] }) => {
    const [activeTab, setActiveTab] = useState('progress');
    const [progressInput, setProgressInput] = useState(challenge.progress.toString());
    const [newMessage, setNewMessage] = useState('');
    
    const handleSaveProgress = () => {
        onUpdateProgress(challenge.id, Number(progressInput));
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        onPostMessage(newMessage);
        setNewMessage('');
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-start">
                    <div><h2 className="text-xl font-bold text-gray-800">{challenge.title}</h2><p className="text-sm text-gray-500">Acompanhe seu progresso e interaja.</p></div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
                </div>
                <div className="border-b"><nav className="flex space-x-4 px-6">
                    <button onClick={() => setActiveTab('progress')} className={`py-3 font-medium border-b-2 ${activeTab === 'progress' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500'}`}>Meu Progresso</button>
                    <button onClick={() => setActiveTab('ranking')} className={`py-3 font-medium border-b-2 ${activeTab === 'ranking' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500'}`}>Ranking</button>
                    <button onClick={() => setActiveTab('community')} className={`py-3 font-medium border-b-2 ${activeTab === 'community' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500'}`}>Comunidade</button>
                </nav></div>
                <div className="p-6 overflow-y-auto flex-grow">
                    {activeTab === 'progress' && (
                        <div className="text-center">
                            <p className="text-lg font-semibold">Seu progresso atual:</p>
                            <p className="text-6xl font-bold text-emerald-600 my-4">{Math.round((challenge.progress / challenge.progressGoal) * 100)}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-emerald-500 h-4 rounded-full" style={{width: `${(challenge.progress / challenge.progressGoal) * 100}%`}}></div></div>
                            <p className="text-gray-600 mt-6 font-semibold">Atualize seu progresso ({challenge.progressUnit}):</p>
                            <input type="number" value={progressInput} onChange={(e) => setProgressInput(e.target.value)} className="w-40 text-center p-2 border rounded-lg mt-2" placeholder="Ex: 85" />
                            <button onClick={handleSaveProgress} className="block w-full mt-4 bg-emerald-500 text-white py-2 rounded-lg font-semibold">Salvar Progresso</button>
                        </div>
                    )}
                    {activeTab === 'ranking' && ( <div className="space-y-3">{mockRanking.map(rank => (<div key={rank.rank} className={`p-3 rounded-lg flex items-center justify-between ${rank.isCurrentUser ? 'bg-emerald-100 border' : 'bg-gray-50'}`}><div className="flex items-center gap-3"><span className="font-bold w-8 text-center">{rank.rank}º</span><p className="font-semibold">{rank.name}</p></div><p className="font-bold">{rank.progress}%</p></div>))}</div> )}
                    {activeTab === 'community' && (
                        <div className="space-y-4">
                            {communityPosts.map(post => (<div key={post.id} className="flex items-start gap-3"><img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" /><div className="bg-gray-100 p-3 rounded-lg flex-grow"><div className="flex justify-between items-center"><p className="font-semibold text-sm">{post.author}</p><p className="text-xs text-gray-500">{post.time}</p></div><p className="text-sm mt-1">{post.message}</p></div></div>))}
                             <div className="flex items-center gap-2 pt-4 border-t"><input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Escreva uma mensagem..." className="w-full p-2 border rounded-lg" /><button onClick={handleSendMessage} className="p-2 bg-emerald-500 text-white rounded-lg"><Send className="w-5 h-5"/></button></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [userPoints, setUserPoints] = useState(780);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(initialCommunity);
  const [activeTab, setActiveTab] = useState('desafios');
  const [redeemingReward, setRedeemingReward] = useState<Reward | null>(null);

  const handleParticipate = (challengeId: string) => {
      setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, isParticipating: true, status: 'Em Andamento' } : c));
      alert(`Você agora está a participar do desafio: ${challenges.find(c=>c.id===challengeId)?.title}`);
  };

  const handleUpdateProgress = (challengeId: string, newProgress: number) => {
      setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, progress: newProgress } : c));
      setSelectedChallenge(prev => prev ? { ...prev, progress: newProgress } : null);
      alert('Progresso atualizado!');
  };
  
  const handlePostMessage = (message: string) => {
      const newPost: CommunityPost = { id: Date.now(), author: 'Você', message, time: 'agora', avatar: 'https://i.pravatar.cc/40?img=5' };
      setCommunityPosts(prev => [...prev, newPost]);
  };

  const handleConfirmRedeem = () => {
      if (!redeemingReward) return;
      if (userPoints < redeemingReward.cost) {
          alert("Você não tem pontos suficientes para resgatar esta recompensa.");
          return;
      }
      setUserPoints(prev => prev - redeemingReward.cost);
  };

  const RewardsTab = () => (
    <div className="space-y-6 mt-6">
        <h2 className="text-xl font-semibold">Loja de Recompensas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRewards.map(reward => (
                <div key={reward.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <img src={reward.image} alt={reward.title} className="w-full h-40 object-cover"/>
                    <div className="p-4">
                        <h3 className="font-bold">{reward.title}</h3>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-semibold text-blue-600 flex items-center gap-1">{reward.cost} <Star size={14} className="fill-current"/></span>
                            <button onClick={() => setRedeemingReward(reward)} className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200">Resgatar</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <>
      <div className="p-6 space-y-8 bg-white min-h-screen">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-gray-800">Desafios de Saúde – Cuide de você de forma divertida!</h1><p className="text-gray-500">Participe de desafios, acumule pontos e transforme sua saúde!</p></div>
          <button onClick={() => setActiveTab('recompensas')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">Ver meus pontos <span className="bg-blue-800 text-xs px-2 py-0.5 rounded-full">{userPoints}</span></button>
        </div>

        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
            <button onClick={() => setActiveTab('desafios')} className={`w-1/2 py-2 rounded-md font-semibold flex items-center justify-center gap-2 ${activeTab === 'desafios' ? 'bg-white shadow' : 'text-gray-600'}`}>
                <Trophy size={16}/> Desafios de Saúde
            </button>
            <button onClick={() => setActiveTab('recompensas')} className={`w-1/2 py-2 rounded-md font-semibold flex items-center justify-center gap-2 ${activeTab === 'recompensas' ? 'bg-white shadow' : 'text-gray-600'}`}>
                <Gift size={16}/> Recompensas <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{userPoints} pontos</span>
            </button>
        </div>
        
        {activeTab === 'desafios' && (
            <>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Destaques Atuais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockFeatured.map(feat => {
                            const Icon = feat.icon;
                            return (
                                <div key={feat.id} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex items-start gap-3">
                                        <Icon className="w-5 h-5 text-blue-600 mt-1"/>
                                        <div>
                                            <h3 className="font-bold">{feat.title}</h3>
                                            <p className="text-xs text-gray-500">{feat.description}</p>
                                            <div className="flex items-center gap-4 text-xs mt-2">
                                                {feat.duration > 0 && <span>Duração: {feat.duration} dias</span>}
                                                <span className="font-bold text-blue-600">+{feat.points} pontos</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => alert(`Participando do desafio: ${feat.title}`)} className="w-full bg-blue-500 text-white py-1.5 rounded-md text-sm font-semibold hover:bg-blue-600 mt-3">Participar</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Desafios de Saúde</h2>
                  </div>
                  <div className="space-y-4">
                    {challenges.map(challenge => {
                        const progressPercentage = (challenge.progress / challenge.progressGoal) * 100;
                        return (
                            <div key={challenge.id} className="bg-white p-4 rounded-lg border grid grid-cols-12 items-center gap-4">
                                <div className="col-span-1">{React.createElement(challenge.icon, { className: "w-8 h-8 text-blue-600" })}</div>
                                <div className="col-span-4"><h3 className="font-bold">{challenge.title}</h3><p className="text-sm text-gray-500">{challenge.description}</p></div>
                                <div className="col-span-2 flex gap-2">{challenge.tags.map(tag => (<span key={tag.label} className={`px-2 py-0.5 text-xs rounded-full font-semibold ${tag.color}`}>{tag.label}</span>))}</div>
                                <div className="col-span-1 text-sm text-gray-500">{challenge.remainingTime}</div>
                                <div className="col-span-3">
                                    <div className="flex justify-between text-xs mb-1"><span className="font-semibold">{challenge.status}</span><span className="text-gray-500">{challenge.progress} / {challenge.progressGoal} {challenge.progressUnit}</span></div>
                                    <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: `${progressPercentage}%`}}></div></div>
                                </div>
                                <div className="col-span-1 text-right">
                                    {challenge.isParticipating ? (
                                        <button onClick={() => setSelectedChallenge(challenge)} className="text-sm font-semibold text-emerald-600 border border-emerald-600 rounded-lg px-3 py-1.5 hover:bg-emerald-50">Acompanhar</button>
                                    ) : (
                                        <button onClick={() => handleParticipate(challenge.id)} className="text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg px-3 py-1.5 hover:bg-blue-50">Participar</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                  </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">Como Funciona</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-bold mb-2">1. Escolha seus desafios</h3>
                            <p className="text-sm text-gray-600">Navegue pelos desafios disponíveis e escolha os que combinam com os seus objetivos de saúde e bem-estar.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-bold mb-2">2. Complete os desafios</h3>
                            <p className="text-sm text-gray-600">Registre seu progresso regularmente e complete as metas para acumular pontos de recompensa.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-bold mb-2">3. Resgate recompensas</h3>
                            <p className="text-sm text-gray-600">Use seus pontos para resgatar benefícios exclusivos, descontos em serviços e produtos especiais.</p>
                        </div>
                    </div>
                </div>
            </>
        )}
        
        {activeTab === 'recompensas' && <RewardsTab />}
      </div>

      {selectedChallenge && (
        <ChallengeDetailModal 
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onUpdateProgress={handleUpdateProgress}
            onPostMessage={handlePostMessage}
            communityPosts={communityPosts}
        />
      )}
      
      {redeemingReward && (
          <RedeemRewardModal
            reward={redeemingReward}
            userPoints={userPoints}
            onClose={() => setRedeemingReward(null)}
            onConfirm={handleConfirmRedeem}
          />
      )}
    </>
  );
}
