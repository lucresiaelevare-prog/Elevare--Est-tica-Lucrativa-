
import React from 'react';
import { TourStep } from '../types';

interface TourModalProps {
    step: TourStep;
    onNext: () => void;
    onPrev?: () => void;
    onClose: () => void;
    isFirst?: boolean;
    isLast?: boolean;
    isGenerating?: boolean;
}

const TourModal: React.FC<TourModalProps> = ({ step, onNext, onPrev, onClose, isFirst, isLast, isGenerating }) => {
    return (
        <div 
            className="fixed inset-0 bg-brand-soft-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col text-center p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors z-10 p-1" aria-label="Fechar Tour">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="text-xl font-serif-display font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{step.content}</p>

                <div className="flex items-center justify-center gap-3">
                    {onPrev && !isFirst && (
                         <button 
                            onClick={onPrev}
                            className="px-6 py-2 border border-brand-lavender/50 rounded-md text-sm font-medium hover:bg-brand-lavender/50 transition-all duration-150 active:scale-95 active:bg-brand-lavender/70"
                        >
                            Voltar
                        </button>
                    )}
                    <button 
                        onClick={onNext}
                        disabled={isGenerating}
                        className="px-6 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80 disabled:bg-gray-400 transition-all duration-150 active:scale-95 active:bg-brand-dark-purple/90"
                    >
                        {isFirst ? "Vamos lá!" : (isGenerating ? "Gerando..." : isLast ? "Começar!" : "Próximo")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourModal;
