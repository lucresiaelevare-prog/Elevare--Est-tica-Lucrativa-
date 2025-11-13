
import React, { useState } from 'react';
import { Trilha } from '../types';

interface TrilhaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trilha: Trilha;
  onActivateTrilha: (trilha: Trilha, projectName: string) => void;
}

const StarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"></path></svg>
);


const TrilhaDetailModal: React.FC<TrilhaDetailModalProps> = ({ isOpen, onClose, trilha, onActivateTrilha }) => {
  if (!isOpen) return null;

  const [isCreatingFunnel, setIsCreatingFunnel] = useState(false);
  const [funnelCreationSuccess, setFunnelCreationSuccess] = useState(false);

  const handleCreateFunnel = () => {
    setIsCreatingFunnel(true);
    setFunnelCreationSuccess(false);
    setTimeout(() => {
      setIsCreatingFunnel(false);
      setFunnelCreationSuccess(true);
    }, 2500); // Simulate API call
  };

  const handleActivate = () => {
    if (trilha.templatePosts) {
        const projectName = prompt(`Digite um nome para o novo projeto baseado na trilha "${trilha.title}":`, `${trilha.title} - Projeto`);
        if (projectName) {
            onActivateTrilha(trilha, projectName);
            onClose();
        }
    } else {
        alert("Esta trilha é conceitual e não gera um projeto automaticamente. Explore as ferramentas relacionadas!");
        onClose();
    }
  };


  const renderFunnelAction = () => {
    if (trilha.action !== 'CREATE_FUNNEL') {
      return null;
    }
    
    return (
      <div className="mt-8 p-4 border-2 border-dashed border-brand-gold/50 rounded-lg bg-brand-gold/10 text-center not-prose">
        <h4 className="font-serif-display text-lg text-brand-dark-purple mb-2">Lucresia ao seu comando ✨</h4>
        {funnelCreationSuccess ? (
            <p className="text-sm text-brand-soft-black/80">
                Sucesso! Seu funil personalizado foi criado e está disponível em <strong>Meu Império</strong>.
            </p>
        ) : (
            <>
                <p className="text-sm text-brand-soft-black/80 mb-4">
                    Com base na sua <strong>Essência da Marca</strong>, posso criar um funil de conversão completo e personalizado para você.
                </p>
                <button 
                    onClick={handleCreateFunnel}
                    disabled={isCreatingFunnel}
                    className="px-4 py-2 bg-brand-gold text-white rounded-md text-sm font-medium hover:bg-brand-gold/80 transition-all duration-150 active:scale-95 disabled:bg-brand-gold/50"
                >
                    {isCreatingFunnel ? 'Criando seu funil...' : 'Criar meu funil personalizado'}
                </button>
            </>
        )}
      </div>
    );
  };

  return (
    <div 
        className="fixed inset-0 bg-brand-soft-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-brand-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10 p-1 bg-white/50 rounded-full" aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <header className="p-6 border-b border-brand-lavender/50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg border border-brand-lavender/50 flex items-center justify-center">
                    <trilha.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                    <h2 className="text-xl font-serif-display font-semibold">{trilha.title}</h2>
                    {trilha.steps && <span className="text-xs font-medium text-brand-lilac bg-brand-lavender/50 px-2 py-0.5 rounded-full">{trilha.steps} Etapas</span>}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-brand-lavender/50 rounded-md text-sm font-medium hover:bg-brand-lavender/50 transition-all duration-150 active:scale-95" aria-label="Salvar nos Favoritos">
                    <StarIcon className="w-4 h-4" /> Salvar
                </button>
                <button 
                    onClick={handleActivate}
                    className="px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80 transition-all duration-150 active:scale-95 active:bg-brand-dark-purple/90">
                    Usar Trilha
                </button>
            </div>
        </header>
        <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 p-8 overflow-y-auto prose prose-sm max-w-none prose-strong:text-brand-soft-black prose-li:my-1">
                {trilha.whyItMatters && (
                    <>
                        <h3 className="font-serif-display text-lg">Por que isso importa?</h3>
                        <p>{trilha.whyItMatters}</p>
                    </>
                )}

                {trilha.howItWorks && trilha.howItWorks.length > 0 && (
                    <details className="group mt-6">
                        <summary className="font-serif-display text-lg list-none cursor-pointer flex items-center gap-2">
                            <ChevronRightIcon className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform flex-shrink-0" />
                            <span>Como funciona?</span>
                        </summary>
                        <div className="pt-2 pl-7">
                            <ol className="list-decimal list-inside space-y-2">
                                {trilha.howItWorks.map((step, index) => (
                                    <li key={index} dangerouslySetInnerHTML={{ __html: step }}/>
                                ))}
                            </ol>
                        </div>
                    </details>
                )}

                {trilha.essentialElements && trilha.essentialElements.length > 0 && (
                     <details className="group mt-6">
                        <summary className="font-serif-display text-lg list-none cursor-pointer flex items-center gap-2">
                            <ChevronRightIcon className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform flex-shrink-0" />
                            <span>Elementos Essenciais</span>
                        </summary>
                        <div className="pt-2 pl-7">
                            <ul className="list-disc list-inside space-y-2">
                                {trilha.essentialElements.map((element, index) => (
                                    <li key={index}>{element}</li>
                                ))}
                            </ul>
                        </div>
                    </details>
                )}

                {renderFunnelAction()}

                {trilha.lucresiaTip && (
                    <div className="mt-6 bg-brand-lavender/30 p-4 rounded-lg not-prose">
                        <h4 className="font-semibold text-brand-dark-purple mb-2">💬 Dica da Lucresia</h4>
                        <p className="text-sm text-brand-soft-black/80">{trilha.lucresiaTip}</p>
                    </div>
                )}
            </main>
            {trilha.relatedTools && trilha.relatedTools.length > 0 && (
                <aside className="w-1/3 border-l border-brand-lavender/50 bg-brand-lavender/20 p-6 overflow-y-auto flex-shrink-0">
                    <h3 className="font-semibold mb-4">Ferramentas da Trilha</h3>
                    <ul className="space-y-1">
                        {trilha.relatedTools.map((tool, index) => (
                            <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-brand-lavender/50 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">{tool}</span>
                                <ChevronRightIcon className="text-gray-400" />
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </div>
      </div>
    </div>
  );
};

export default TrilhaDetailModal;
