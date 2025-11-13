
import React, { useState } from 'react';
// Fix: import TrilhaCategory from '../types' as it is not exported from constants.
import { trilhas } from '../constants';
import { Trilha, TrilhaCategory } from '../types';

interface TrilhaCardProps {
  trilha: Trilha;
  onSelect: (trilha: Trilha) => void;
}

const StarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const TrilhaCard: React.FC<TrilhaCardProps> = ({ trilha, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(trilha)}
      className="bg-white border border-brand-lavender/60 rounded-xl shadow-sm p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-lg hover:border-brand-lilac hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="w-11 h-11 rounded-xl border border-brand-lavender/70 bg-white flex items-center justify-center flex-shrink-0">
          <trilha.icon className="w-6 h-6 text-brand-gold" />
        </div>
        <div>
          <h3 className="font-bold text-brand-soft-black text-base leading-tight">{trilha.title}</h3>
          {trilha.steps && <span className="text-xs font-medium text-brand-lilac bg-brand-lavender/50 px-2 py-0.5 rounded-full">{trilha.steps} Etapas</span>}
        </div>
      </div>
      <p className="text-sm text-gray-600 flex-1">{trilha.description}</p>
      <button
        onClick={() => onSelect(trilha)}
        className="w-full mt-3 px-4 py-2 bg-brand-gold text-white rounded-lg text-sm font-semibold hover:bg-brand-gold/90 transition-all duration-150 active:scale-95 shadow-md shadow-brand-gold/20"
      >
        Ver Detalhes
      </button>
    </div>
  );
};


interface TrilhasViewProps {
  onSelectTrilha: (trilha: Trilha) => void;
}

const allCategories: ('Todas' | TrilhaCategory)[] = ['Todas', 'Relacionamento & Fidelização', 'Criação de Conteúdo', 'Vendas & Ofertas', 'Estratégia & Negócios'];

const TrilhasView: React.FC<TrilhasViewProps> = ({ onSelectTrilha }) => {
    const [activeCategory, setActiveCategory] = useState<'Todas' | TrilhaCategory>('Todas');

    const filteredTrilhas = trilhas.filter(t => activeCategory === 'Todas' || t.category === activeCategory);

    return (
        <div className="h-full flex flex-col p-8 bg-gray-50/50">
            <header className="mb-8">
                <h1 className="text-3xl font-serif-display font-semibold text-brand-soft-black">Trilhas Estratégicas</h1>
                <p className="text-gray-500 mt-1 max-w-2xl">Caminhos prontos para executar campanhas de marketing eficazes com um clique.</p>
            </header>

            <div className="flex items-center gap-2 border-b border-brand-lavender/50 mb-8">
                {allCategories.map(cat => (
                     <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeCategory === cat ? 'text-brand-dark-purple border-b-2 border-brand-lilac' : 'text-gray-500 hover:text-brand-dark-purple'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <main className="flex-1 overflow-y-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTrilhas.map(trilha => (
                        <TrilhaCard key={trilha.id} trilha={trilha} onSelect={onSelectTrilha} />
                    ))}
                 </div>
            </main>
        </div>
    );
};

export default TrilhasView;
