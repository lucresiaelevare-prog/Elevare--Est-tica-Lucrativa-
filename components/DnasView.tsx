
import React, { useState } from 'react';
import { Essencia, TourStep } from '../types';
import TourModal from './TourModal';

interface EssenciaViewProps {
    onSelectEssencia: (id: string) => void;
    essencias: Essencia[];
}

const tourSteps: TourStep[] = [
    {
        title: "Essência da Marca",
        content: <>A Essência da Marca é a <strong>alma</strong> de tudo o que você irá criar. Ela alimenta diretamente a <strong>inteligência</strong> das mentoras.<br/><br/>Essência superficial -&gt; Criações boas<br/>Essência profunda e atualizada -&gt; Criações <strong>INCRÍVEIS</strong> (que convertem)<br/><br/>Aqui é onde você cria, edita e lapida o seu <strong>Clone de IA exclusivo</strong> — ou do seu cliente — para usar como base de contexto.</>
    },
    {
        title: "Pilares da Essência",
        content: <>Sua Essência é separada em: <strong>Personalidade, Público e Produto/Serviço</strong>.<br/><br/>Eles se complementam e promovem mais liberdade para o contexto das suas criações. Você já tem cada um deles pré-criados.<br/><br/>Clique em "Personalidade" para revisar e refinar.</>
    }
];

const EssenciaCard: React.FC<{ essencia: Essencia, onSelect: () => void }> = ({ essencia, onSelect }) => (
    <button 
        onClick={onSelect}
        className="bg-white border border-brand-lavender/50 rounded-lg p-6 flex flex-col gap-3 hover:shadow-md hover:border-brand-lilac transition-all duration-200 cursor-pointer text-center items-center hover:-translate-y-1 active:scale-[0.98]"
    >
        <div className="w-12 h-12 rounded-full border-2 border-brand-lavender/50 flex items-center justify-center mb-3">
            <essencia.icon className="w-6 h-6 text-brand-gold" />
        </div>
        <h3 className="font-semibold text-brand-soft-black">{essencia.title} ✨</h3>
        <p className="text-sm text-gray-500">{essencia.description}</p>
    </button>
)

const EssenciaView: React.FC<EssenciaViewProps> = ({ onSelectEssencia, essencias }) => {
    const [isTourActive, setTourActive] = useState(true);
    const [tourStep, setTourStep] = useState(0);

    const handleNextStep = () => {
        if (tourStep < tourSteps.length - 1) {
            setTourStep(tourStep + 1);
        } else {
            setTourActive(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
           <header className="p-6 border-b border-brand-lavender/50 flex justify-between items-center">
             <div className="flex flex-col">
                <h1 className="text-2xl font-serif-display">Essência da Marca</h1>
                <p className="text-gray-500 text-sm mt-1">Defina sua Personalidade, Público e Produto/Serviço para dar contexto às mentoras.</p>
             </div>
             <button className="px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80 flex items-center gap-2 transition-all duration-150 active:scale-95 active:bg-brand-dark-purple/90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>
                Nova Essência
             </button>
           </header>
           <main className="flex-1 p-8 bg-brand-lavender/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {essencias.map(essencia => (
                        <EssenciaCard key={essencia.id} essencia={essencia} onSelect={() => onSelectEssencia(essencia.id)} />
                    ))}
                </div>
           </main>
            {isTourActive && tourStep < tourSteps.length && (
                <TourModal
                    step={tourSteps[tourStep]}
                    onNext={handleNextStep}
                    isFirst={tourStep === 0}
                    isLast={tourStep === tourSteps.length - 1}
                    onClose={() => setTourActive(false)}
                />
            )}
        </div>
      );
}

export default EssenciaView;
