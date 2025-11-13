import React from 'react';
import { ActiveView, UserProfile } from '../types';
import { navItems, mockUserProfile } from '../constants';

interface DashboardViewProps {
    onNavigate: (view: ActiveView) => void;
}

const DnaIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15.2 3.8a2.2 2.2 0 0 1 3.1 0l1.4 1.4a2.2 2.2 0 0 1 0 3.1L6.5 21.5a1.4 1.4 0 0 1-2 0L3.1 20.1a1.4 1.4 0 0 1 0-2l12.1-12.1z"></path><path d="M8.2 5.8a2.2 2.2 0 0 0-3.1 0L3.7 7.2a2.2 2.2 0 0 0 0 3.1l7.8 7.9a1.4 1.4 0 0 0 2 0l1.4-1.4a1.4 1.4 0 0 0 0-2L8.2 5.8z"></path></svg>
);

const UserProfileCard: React.FC<{ user: UserProfile }> = ({ user }) => (
    <div className="bg-white border border-brand-lavender/50 rounded-2xl p-6 shadow-subtle h-full flex flex-col">
        <h3 className="font-serif-display text-lg text-brand-dark-purple mb-4">Minha Conta & Recompensas</h3>
        <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Seu saldo</p>
            <p className="text-4xl font-bold text-brand-dark-purple flex items-center justify-center gap-2">
                {user.elo} <span className="text-2xl font-serif-display text-brand-gold">Elo</span>
            </p>
        </div>
        <div>
            <h4 className="font-semibold text-sm mb-2 text-gray-600">Conquistas</h4>
            <div className="flex items-center gap-3">
                {user.badges.map(badge => (
                    <div key={badge.id} className="w-10 h-10 bg-brand-lavender/40 rounded-full flex items-center justify-center text-lg" title={`${badge.title}: ${badge.description}`}>
                        {badge.icon}
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Indique colegas e ganhe +10 Elo por cada cadastro confirmado.</p>
        </div>
    </div>
);

const RoiCheckpointCard: React.FC = () => (
    <div className="bg-brand-dark-purple text-white rounded-2xl p-6 shadow-subtle h-full flex flex-col">
         <h3 className="font-serif-display text-lg text-white mb-4">Checkpoint de Resultados</h3>
         <p className="text-sm text-brand-lilac mb-4">Em apenas 7 dias usando a Elevare, veja seu progresso:</p>
         <div className="space-y-3">
             <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-bold text-2xl text-white">12h</p>
                <p className="text-xs text-brand-lilac">de tempo economizado em criação de conteúdo</p>
            </div>
             <div className="bg-white/10 p-3 rounded-lg">
                <p className="font-bold text-2xl text-white">R$ 250</p>
                <p className="text-xs text-brand-lilac">de economia estimada com redução de faltas</p>
            </div>
         </div>
    </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {

    const quickLinks = navItems.filter(item => 
        ['Gerador de Pautas', 'Projetos', 'Jornada da Cliente'].includes(item.name)
    );

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <header className="mb-8 md:mb-10">
                <h1 className="text-3xl md:text-4xl font-serif-display text-brand-soft-black">Bem-vinda, {mockUserProfile.name}</h1>
                <p className="text-brand-graphite/80 mt-2 text-base md:text-lg">Seu centro de comando para uma estética com estratégia e lucro.</p>
            </header>
            
            <div className="mb-8 p-4 bg-brand-gold/20 border border-brand-gold rounded-lg text-center">
                <p className="font-semibold text-brand-dark-purple">Seu período de teste termina em 48h!</p>
                <p className="text-sm text-brand-graphite/90 mt-1">Assine o plano Pro anual e ganhe 1 ano de LÉXIA grátis.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2">
                     <div className="bg-gradient-to-br from-brand-lavender/40 via-white to-brand-nude/30 border border-brand-lavender/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-lg h-full">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-subtle">
                            <DnaIcon className="w-10 h-10 md:w-12 md:h-12 text-brand-dark-purple" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl md:text-2xl font-serif-display font-semibold text-brand-dark-purple mb-2">O Ponto de Partida para o Lucro</h2>
                            <p className="text-brand-graphite mb-4 text-sm md:text-base">Defina a <strong>Essência da Marca</strong> — a alma do seu negócio. Este é o primeiro passo para personalizar todas as criações da LucresIA e garantir que cada conteúdo fale diretamente com seu cliente ideal.</p>
                            <button 
                                onClick={() => onNavigate('Essência da Marca')}
                                className="px-5 py-2.5 md:px-6 md:py-3 bg-brand-dark-purple text-white rounded-lg font-semibold hover:bg-brand-dark-purple/90 transition-all duration-150 active:scale-95 shadow-md shadow-brand-dark-purple/30">
                                Definir Essência da Marca
                            </button>
                        </div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <UserProfileCard user={mockUserProfile} />
                    <RoiCheckpointCard />
                </div>
            </div>

            <section>
                <h2 className="text-lg md:text-xl font-serif-display font-medium text-brand-dark-purple mb-4">Acessos Rápidos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {quickLinks.map(item => (
                         <div key={item.name} 
                            onClick={() => onNavigate(item.name)}
                            className="bg-white border border-brand-lavender/50 rounded-xl p-6 flex items-start gap-4 shadow-subtle hover:shadow-xl hover:border-brand-lilac transition-all duration-200 cursor-pointer hover:-translate-y-1 active:scale-[0.98]">
                            {item.icon && 
                                <div className="w-12 h-12 rounded-xl border border-brand-lavender/70 bg-white flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-6 h-6 text-brand-gold" />
                                </div>
                            }
                            <div>
                                <h3 className="font-bold text-brand-soft-black text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Acesse a seção para começar.</p>
                            </div>
                         </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DashboardView;