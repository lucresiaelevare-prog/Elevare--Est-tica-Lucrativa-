
import React from 'react';
import { JourneyStage } from '../types';

interface JornadaStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: JourneyStage;
  onGenerate: (prompt: string) => void;
}

const JornadaStageModal: React.FC<JornadaStageModalProps> = ({ isOpen, onClose, stage, onGenerate }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-brand-soft-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-brand-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-brand-lavender/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-brand-lavender/50 bg-brand-lavender/20 flex items-center justify-center flex-shrink-0">
                <stage.icon className="w-6 h-6 text-brand-dark-purple" />
            </div>
            <div>
                 <h2 className="text-xl font-serif-display font-semibold">{stage.title}</h2>
                 <p className="text-sm text-gray-500">{stage.description}</p>
            </div>
        </header>
        <main className="p-6">
            <div className="bg-brand-gold/10 p-4 rounded-lg">
                <h4 className="font-serif-display text-base text-brand-gold mb-2">Mentoria Rápida 🧠</h4>
                <p className="text-sm text-brand-graphite">{stage.mentorTip}</p>
            </div>
        </main>
        <footer className="p-4 bg-gray-50 border-t border-brand-lavender/50 flex flex-col sm:flex-row justify-end items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 w-full sm:w-auto">
                Fechar
            </button>
            <button 
                onClick={() => onGenerate(stage.generationPrompt)} 
                className="px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80 w-full sm:w-auto"
            >
                Gerar Conteúdo para esta Etapa
            </button>
        </footer>
      </div>
    </div>
  );
};

export default JornadaStageModal;
